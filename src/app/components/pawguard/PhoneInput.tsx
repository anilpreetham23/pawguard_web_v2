"use client";

import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import {
  SUPPORTED_COUNTRIES,
  getCountryByCode,
  sanitizePhoneInput,
} from "@/lib/utils/validation";
import { cn } from "../ui/utils";

export interface PhoneInputProps
  extends Omit<React.ComponentProps<"input">, "onChange" | "value"> {
  label?: string;
  value: string;
  countryCode?: string;
  onValueChange: (nationalNumber: string, countryCode: string) => void;
  onCountryChange?: (countryCode: string) => void;
  error?: string;
  helper?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  function PhoneInput(
    {
      className,
      label,
      value,
      countryCode = "IN",
      onValueChange,
      onCountryChange,
      error,
      helper,
      id,
      required,
      disabled,
      placeholder,
      ...props
    },
    ref
  ) {
    const selectedCountry = getCountryByCode(countryCode);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : "phone-input");

    const handleCountrySelect = (newCountryCode: string) => {
      if (onCountryChange) {
        onCountryChange(newCountryCode);
      }
      const reSanitized = sanitizePhoneInput(value, newCountryCode);
      onValueChange(reSanitized, newCountryCode);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitized = sanitizePhoneInput(e.target.value, countryCode);
      onValueChange(sanitized, countryCode);
    };

    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-foreground text-xs font-semibold tracking-wider uppercase font-condensed"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative flex items-center w-full rounded-input border bg-input-background transition-all duration-gentle ease-gentle",
            error
              ? "border-destructive focus-within:border-destructive focus-within:ring-2 focus-within:ring-destructive/20"
              : "border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 focus-within:shadow-glow-soft"
          )}
        >
          {/* Country Selector Dropdown */}
          <div className="relative border-r border-border shrink-0">
            <select
              aria-label="Select country code"
              value={countryCode}
              onChange={(e) => handleCountrySelect(e.target.value)}
              disabled={disabled}
              className="appearance-none bg-transparent h-12 pl-3.5 pr-7 text-sm font-semibold text-foreground cursor-pointer focus:outline-none disabled:cursor-not-allowed"
            >
              {SUPPORTED_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-card text-foreground">
                  {c.flag} {c.name} ({c.dialCode})
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>

          {/* National Phone Number Input */}
          <input
            ref={ref}
            id={inputId}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={selectedCountry.maxLength}
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder ?? selectedCountry.placeholder}
            disabled={disabled}
            required={required}
            aria-required={required ? "true" : undefined}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined
            }
            className={cn(
              "w-full h-12 bg-transparent px-3 text-foreground text-base placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-destructive text-xs" role="alert">
            {error}
          </p>
        )}
        {helper && !error && (
          <p id={`${inputId}-helper`} className="text-muted-foreground text-xs">
            {helper}
          </p>
        )}
      </div>
    );
  }
);
