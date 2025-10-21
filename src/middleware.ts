// middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function middleware(req: any) {
  const session = await auth();
  const pathname = req.nextUrl.pathname;

  // Nếu không có session (chưa đăng nhập)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role;

  // Role: admin - Truy cập toàn bộ
  if (role === "admin") {
    return NextResponse.next(); // Cho phép tất cả request
  }

  // Role: manage - Truy cập /dashboard, /manage/department, /manage/position
  if (role === "manager") {
    if (
      pathname.startsWith("/dashboard/department") ||
      pathname.startsWith("/dashboard/position") ||
      pathname === "/dashboard"
    ) {
      return NextResponse.next(); // Cho phép
    }
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Role: employee - Chỉ truy cập /employee/*
  if (role === "employee") {
    if (pathname.startsWith("/employee")) {
      return NextResponse.next(); // Cho phép
    }
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Trường hợp role không hợp lệ
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export const config = {
  matcher: ["/dashboard/:path*"],
  // matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
