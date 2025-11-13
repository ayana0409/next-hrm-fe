"use client";

import { Card, Col, Row } from "antd";
import PieChart from "../chart/pie.chart";
import { useEffect, useRef, useState } from "react";
import { useAxiosAuth } from "@/utils/customHook";
import { useSession } from "next-auth/react";

const AdminCard = () => {
  const isMounted = useRef(false);
  const { status } = useSession();
  const authAxios = useAxiosAuth();
  const [chartData, setChartData] = useState<{ value: number; name: string }[]>(
    []
  );
  const fetchData = () => {
    authAxios
      .get("dashboard")
      .then((response) => {
        const { total, checkOut, halfDay, onboard, offEmp } =
          response.data.data;
        setChartData([
          { value: onboard, name: "On time" },
          { value: halfDay, name: "Half day" },
          { value: checkOut, name: "Check out" },
          { value: offEmp, name: "Off" },
          {
            value: total - checkOut - halfDay - onboard - offEmp,
            name: "Remaining",
          },
        ]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (!isMounted.current) {
        fetchData();
        isMounted.current = true;
      } else {
        fetchData();
      }
    }
  }, [status]);

  return (
    <>
      <Row gutter={16}>
        <Col span={8}>
          <Card
            title="Current Shift Status of Employees"
            variant={"borderless"}
          >
            <PieChart
              id="pie-chart"
              subtext="Status summary for today's workforce participation"
              data={chartData}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Number" variant={"borderless"}>
            Updating...
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Top over-time" variant={"borderless"}>
            Updating...
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AdminCard;
