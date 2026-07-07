import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";
import type { StudyPlan } from "@/lib/types";
import { markTaskComplete } from "@/lib/study-plan";

export async function GET() {
  try {
    const session = await requireSession();
    const record = await prisma.userStudyPlan.findUnique({
      where: { profileId: session.profileId },
    });
    if (!record) {
      return NextResponse.json(null);
    }
    return NextResponse.json(JSON.parse(record.planData) as StudyPlan);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const plan = (await request.json()) as StudyPlan;

    await prisma.userStudyPlan.upsert({
      where: { profileId: session.profileId },
      create: { profileId: session.profileId, planData: JSON.stringify(plan) },
      update: { planData: JSON.stringify(plan) },
    });

    return NextResponse.json(plan);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireSession();
    const body = await request.json();

    const record = await prisma.userStudyPlan.findUnique({
      where: { profileId: session.profileId },
    });
    if (!record) {
      return NextResponse.json({ error: "No study plan found" }, { status: 404 });
    }

    let plan = JSON.parse(record.planData) as StudyPlan;

    if (body.action === "markTaskComplete") {
      plan = markTaskComplete(plan, body.taskId as string);
    } else if (body.action === "update") {
      plan = body.plan as StudyPlan;
    }

    await prisma.userStudyPlan.update({
      where: { profileId: session.profileId },
      data: { planData: JSON.stringify(plan) },
    });

    return NextResponse.json(plan);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE() {
  try {
    const session = await requireSession();
    await prisma.userStudyPlan.deleteMany({ where: { profileId: session.profileId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
