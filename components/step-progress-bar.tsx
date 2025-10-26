"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Check } from "lucide-react";

const steps = [
  { label: "Home", path: "/" },
  { label: "Cart", path: "/cart" },
  { label: "Checkout", path: "/checkout" },
];

function CustomStepIcon({
  active,
  completed,
}: {
  active?: boolean;
  completed?: boolean;
}) {
  return (
    <div className="relative flex items-center justify-center w-8 h-8">
      {completed ? (
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      ) : (
        <div
          className={`w-8 h-8 rounded-full ${
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
      <Stepper activeStep={activeStep}>
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
