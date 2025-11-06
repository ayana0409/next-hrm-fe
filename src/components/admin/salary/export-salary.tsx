"use client";
import React from "react";
import { Button, Tooltip } from "antd";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Salary } from "@/types/salary";
import { DownloadOutlined } from "@ant-design/icons";

pdfMake.vfs = pdfFonts.vfs;

export default function ExportSalary({ data }: { data: Salary }) {
  const handleExportPDF = () => {
    const docDefinition = {
      pageSize: "A4",
      pageMargins: [40, 60, 40, 60],
      content: [
        { text: `PAY SLIP FOR ${data.month}`, style: "title" },

        // Employee info
        { text: "I. Employee infomations", style: "sectionHeader" },
        {
          style: "infoTable",
          table: {
            widths: ["30%", "70%"],
            body: [
              ["Name", data.fullName],
              ["Department", data.department],
              ["Position", data.position],
              ["Level", data.level],
            ],
          },
          layout: "noBorders",
        },

        // Attendance
        { text: "II. Attendance details", style: "sectionHeader" },
        {
          style: "attendanceTable",
          table: {
            widths: ["60%", "40%"],
            body: [
              ["Absence (day)", data.absenceDays],
              ["Late (minute)", data.lateMinutes],
              ["Over time (hour)", data.oTHours],
              ["Off (day)", data.offDates],
            ],
          },
          layout: "lightHorizontalLines",
        },

        // Regulation
        { text: "III. Regulations", style: "sectionHeader" },
        {
          style: "regulationTable",
          table: {
            widths: ["60%", "40%"],
            body: [
              ["Late penalty (VND/minute)", data.latePenaltyPerMinute],
              ["Absence penalty (VND/day)", data.absencePenaltyPerDate],
              ["Over time rate", data.overTimeRate],
            ],
          },
          layout: "lightHorizontalLines",
        },

        // Chi tiết lương
        { text: "IV. Salary details", style: "sectionHeader" },
        {
          style: "salaryTable",
          table: {
            widths: ["50%", "50%"],
            body: [
              ["Base salary", `${data.baseSalary.toLocaleString()} VND`],
              ["Bonus", `${data.bonus.toLocaleString()} VND`],
              ["Deduction", `${data.deductions.toLocaleString()} VND`],
              [
                { text: "NET", bold: true },
                { text: `${data.netSalary.toLocaleString()} VND`, bold: true },
              ],
            ],
          },
          layout: "lightHorizontalLines",
        },

        // Footer
        {
          text: `Print date: ${new Date().toLocaleDateString("vi-VN")}`,
          style: "footer",
        },
      ],
      styles: {
        title: {
          fontSize: 18,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 20],
        },
        sectionHeader: {
          fontSize: 13,
          bold: true,
          margin: [0, 10, 0, 5],
          color: "#2c3e50",
        },
        infoTable: { margin: [0, 0, 0, 10] },
        salaryTable: { margin: [0, 0, 0, 10] },
        attendanceTable: { margin: [0, 0, 0, 10] },
        footer: {
          fontSize: 10,
          italics: true,
          alignment: "right",
          margin: [0, 20, 0, 0],
        },
      },
    };

    pdfMake
      .createPdf(docDefinition)
      .download(`salary-${data.fullName}-${data.month}.pdf`);
  };

  return (
    <div>
      <Tooltip title="Export PDF">
        <Button type="primary" onClick={handleExportPDF}>
          <DownloadOutlined className="text-lg" />
        </Button>
      </Tooltip>
    </div>
  );
}
