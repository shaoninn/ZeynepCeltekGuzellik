"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type StagedContent = { content: string; title?: string };

type EditorContextValue = {
  enabled: boolean;
  saving: boolean;
  setSaving: (v: boolean) => void;
  status: string | null;
  setStatus: (msg: string | null) => void;
  dirtyCount: number;
  /** Bumps when drafts are discarded — components should reset from props. */
  draftEpoch: number;
  bumpDirty: (delta: number) => void;
  /** Stage content change (does not publish until commitAll). */
  saveContent: (key: string, content: string, title?: string) => Promise<boolean>;
  /** Stage setting change (does not publish until commitAll). */
  saveSetting: (key: string, value: string) => Promise<boolean>;
  commitAll: () => Promise<boolean>;
  discardAll: () => void;
  /** Confirm if dirty; returns true if navigation may proceed. */
  confirmLeave: (message?: string) => boolean;
};

const EditorContext = createContext<EditorContextValue | null>(null);

const noopAsync = async () => false;

export function EditorProvider({
  children,
  enabled = true,
}: {
  children: ReactNode;
  enabled?: boolean;
}) {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [contentDrafts, setContentDrafts] = useState<
    Record<string, StagedContent>
  >({});
  const [settingDrafts, setSettingDrafts] = useState<Record<string, string>>(
    {}
  );
  const [draftEpoch, setDraftEpoch] = useState(0);
  /** Extra dirty from category fields etc. that save via their own API. */
  const [extraDirty, setExtraDirty] = useState(0);

  const dirtyCount =
    Object.keys(contentDrafts).length +
    Object.keys(settingDrafts).length +
    extraDirty;

  const bumpDirty = useCallback((delta: number) => {
    setExtraDirty((n) => Math.max(0, n + delta));
  }, []);

  const saveContent = useCallback(
    async (key: string, content: string, title?: string) => {
      setContentDrafts((prev) => {
        const existing = prev[key];
        return {
          ...prev,
          [key]: {
            content,
            title: title !== undefined ? title : existing?.title,
          },
        };
      });
      setStatus("Kaydedilmedi — üstten Kaydet’e basın");
      return true;
    },
    []
  );

  const saveSetting = useCallback(async (key: string, value: string) => {
    setSettingDrafts((prev) => ({ ...prev, [key]: value }));
    setStatus("Kaydedilmedi — üstten Kaydet’e basın");
    return true;
  }, []);

  const commitAll = useCallback(async () => {
    const contents = { ...contentDrafts };
    const settings = { ...settingDrafts };
    const contentKeys = Object.keys(contents);
    const settingKeys = Object.keys(settings);
    if (contentKeys.length === 0 && settingKeys.length === 0) {
      setStatus("Kaydedilecek değişiklik yok");
      setTimeout(() => setStatus(null), 2000);
      return true;
    }

    setSaving(true);
    setStatus("Kaydediliyor…");
    try {
      for (const key of contentKeys) {
        const row = contents[key]!;
        const body: { key: string; content: string; title?: string } = {
          key,
          content: row.content,
        };
        if (row.title !== undefined) body.title = row.title;
        const res = await fetch("/api/content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) throw new Error(data.error || `Kayıt başarısız: ${key}`);
      }

      if (settingKeys.length > 0) {
        const res = await fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) throw new Error(data.error || "Ayarlar kaydedilemedi");
      }

      setContentDrafts({});
      setSettingDrafts({});
      setStatus("Kaydedildi");
      setTimeout(() => setStatus(null), 2500);
      return true;
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Kayıt hatası");
      return false;
    } finally {
      setSaving(false);
    }
  }, [contentDrafts, settingDrafts]);

  const discardAll = useCallback(() => {
    setContentDrafts({});
    setSettingDrafts({});
    setExtraDirty(0);
    setDraftEpoch((n) => n + 1);
    setStatus("Değişiklikler geri alındı");
    setTimeout(() => setStatus(null), 2500);
  }, []);

  const confirmLeave = useCallback(
    (message?: string) => {
      if (dirtyCount <= 0) return true;
      return window.confirm(
        message ||
          "Kaydedilmemiş değişiklikler var. Çıkarsanız kaybolur. Devam edilsin mi?"
      );
    },
    [dirtyCount]
  );

  const value = useMemo(
    () => ({
      enabled,
      saving,
      setSaving,
      status,
      setStatus,
      dirtyCount,
      draftEpoch,
      bumpDirty,
      saveContent,
      saveSetting,
      commitAll,
      discardAll,
      confirmLeave,
    }),
    [
      enabled,
      saving,
      status,
      dirtyCount,
      draftEpoch,
      bumpDirty,
      saveContent,
      saveSetting,
      commitAll,
      discardAll,
      confirmLeave,
    ]
  );

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditor(): EditorContextValue {
  const ctx = useContext(EditorContext);
  if (!ctx) {
    return {
      enabled: false,
      saving: false,
      setSaving: () => undefined,
      status: null,
      setStatus: () => undefined,
      dirtyCount: 0,
      draftEpoch: 0,
      bumpDirty: () => undefined,
      saveContent: noopAsync,
      saveSetting: noopAsync,
      commitAll: noopAsync,
      discardAll: () => undefined,
      confirmLeave: () => true,
    };
  }
  return ctx;
}
