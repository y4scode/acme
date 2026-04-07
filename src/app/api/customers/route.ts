import {
    NextRequest,
    NextResponse
} from 'next/server';
import { CustomerController } from '@/src/controllers/CustomerController';
import { getFallbackRouteParams } from 'next/dist/server/request/fallback-params';

const {
    getAll,
    create
} = CustomerController

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const result = await getAll(searchParams);

    return NextResponse.json(
        result.body,
        { status: result.status }
    );
};

export async function POST(request: NextRequest) {
    const body = await request.json();

    const result = await create(body);

    return NextResponse.json(
        result.body,
        { status: result.status }
    );
};