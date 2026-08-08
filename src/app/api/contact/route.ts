import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalı"),
  phone: z.string().min(10, "Geçerli bir telefon numarası girin"),
  email: z.string().email().optional().or(z.literal("")),
  subject: z.string().optional(),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalı").max(800),
  kvkkAccepted: z
    .boolean()
    .refine((v) => v === true, { message: "KVKK onayı gerekli" }),
});

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const limited = rateLimit(`contact:${ip}`, 6, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Çok fazla mesaj. Lütfen biraz sonra tekrar deneyin." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    await prisma.contactMessage.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        subject: data.subject || null,
        message: data.message,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Mesaj gönderilemedi" },
      { status: 500 }
    );
  }
}
