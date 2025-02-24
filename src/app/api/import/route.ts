import { NextResponse } from "next/server";
import { importProductsFromXML } from "@/lib/xml-import";

export async function POST(request: Request) {
    const { url } = await request.json();

    if (!url) {
        return NextResponse.json(
            { error: "Будь ласка, вкажіть URL до XML-файлу" },
            { status: 400 }
        );
    }

    const result = await importProductsFromXML(url);
    return NextResponse.json(result);
}