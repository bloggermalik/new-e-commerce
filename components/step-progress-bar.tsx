"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import { Check } from "lucide-react";

const steps = [
  { label: "Home", path: "/" },
  { label: "Cart", path: "/cart" },
  { label: "Checkout", path: "/checkout" },
];

// Custom green connector
const GreenConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 12,
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#cbd5e1", // gray for pending
    borderRadius: 1,
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    backgroundColor: "#22c55e", // green for active
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    backgroundColor: "#22c55e", // green for completed
  },
}));

function CustomStepIcon({
  active,
  completed,
}: {
  active?: boolean;
  completed?: boolean;
}) {
  return (
    <div className="relative flex items-center justify-center md:w-8 md:h-8 w-6 h-6">
      {completed ? (
        <div className="md:w-8 md:h-8 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <Check className="md:w-4 md:h-4 w-3 h-3 text-white" />
        </div>
      ) : (
        <div
          className={`md:w-8 md:h-8 w-6 h-6 rounded-full ${
            active ? "bg-green-500 " : "bg-gray-300"
          }`}
        />
      )}
    </div>
  );
}

export default function StepProgressBar() {
  const pathname = usePathname();
  const router = useRouter();

  const activeStep = React.useMemo(() => {
    const index = steps.findIndex((step) => step.path === pathname);
    return index >= 0 ? index : 0;
  }, [pathname]);

  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel connector={<GreenConnector />}>
        {steps.map((step, index) => (
          <Step key={step.label} completed={index < activeStep}>
            <StepLabel
              StepIconComponent={() => (
                <CustomStepIcon
                  active={index === activeStep}
                  completed={index < activeStep}
                />
              )}
              onClick={() => router.push(step.path)}
              sx={{ cursor: "pointer" }}
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
