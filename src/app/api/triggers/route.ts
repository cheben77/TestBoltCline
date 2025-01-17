import { NextRequest, NextResponse } from 'next/server';
import { TRIGGERS } from '@/lib/triggers';
import { workflowService } from '@/services/workflowService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const trigger = TRIGGERS[id];
      if (!trigger) {
        return NextResponse.json(
          { error: `Trigger ${id} not found` },
          { status: 404 }
        );
      }
      return NextResponse.json(trigger);
    }

    return NextResponse.json(Object.values(TRIGGERS));
  } catch (error) {
    console.error('Error fetching triggers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { triggerId, params } = await request.json();

    const trigger = TRIGGERS[triggerId];
    if (!trigger) {
      return NextResponse.json(
        { error: `Trigger ${triggerId} not found` },
        { status: 404 }
      );
    }

    const result = await trigger.execute(params);
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error executing trigger:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
