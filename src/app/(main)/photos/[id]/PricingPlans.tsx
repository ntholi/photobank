'use client';
import React from 'react';
import { RadioGroup, Radio, cn } from '@nextui-org/react';

const CustomRadio = (props: any) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          'inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between',
          'flex-row-reverse max-w-[300p] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent',
          'data-[selected=true]:border-primary',
        ),
      }}
    >
      {children}
    </Radio>
  );
};

export default function PricingPlans() {
  return (
    <RadioGroup
      label="Pricing Plans"
      description="Selected plan can be changed at any time."
      onValueChange={(value) => console.log(value)}
    >
      <CustomRadio description="With Watermark (WebP)" value="free">
        Free
      </CustomRadio>
      <CustomRadio description="M70.00 (3840 x 2560 / JPEG)" value="large">
        Large
      </CustomRadio>
      <CustomRadio description="M120.00 (5760 x 3840 / JPEG)" value="original">
        Original Size
        <span className="text-gray-500 text-sm"></span>
      </CustomRadio>
    </RadioGroup>
  );
}
