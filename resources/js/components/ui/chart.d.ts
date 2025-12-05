import * as React from 'react';

export interface ChartConfig {
  [key: string]: {
    label?: string;
    color?: string;
    theme?: {
      light?: string;
      dark?: string;
    };
    icon?: React.ComponentType;
  };
}

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  config: ChartConfig;
  children: React.ReactNode;
}

export interface ChartTooltipContentProps {
  active?: boolean;
  payload?: any[];
  className?: string;
  indicator?: 'dot' | 'line' | 'dashed';
  hideLabel?: boolean;
  hideIndicator?: boolean;
  label?: string | number;
  labelFormatter?: (value: any, payload: any[]) => React.ReactNode;
  formatter?: (value: any, name: string, item: any, index: number, payload: any) => React.ReactNode;
  color?: string;
  nameKey?: string;
  labelKey?: string;
  labelClassName?: string;
}

export interface ChartLegendContentProps {
  className?: string;
  hideIcon?: boolean;
  payload?: any[];
  verticalAlign?: 'top' | 'bottom';
  nameKey?: string;
}

export type { ChartConfig, ChartContainerProps, ChartTooltipContentProps, ChartLegendContentProps };

export declare const ChartContainer: React.ForwardRefExoticComponent<ChartContainerProps & React.RefAttributes<HTMLDivElement>>;
export declare const ChartTooltip: React.ComponentType<any>;
export declare const ChartTooltipContent: React.ForwardRefExoticComponent<ChartTooltipContentProps & React.RefAttributes<HTMLDivElement>>;
export declare const ChartLegend: React.ComponentType<any>;
export declare const ChartLegendContent: React.ForwardRefExoticComponent<ChartLegendContentProps & React.RefAttributes<HTMLDivElement>>;

