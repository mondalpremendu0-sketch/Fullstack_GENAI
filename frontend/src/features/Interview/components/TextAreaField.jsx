import React from "react";
import { motion } from "framer-motion";
import "../styles/FormFields.scss";

export default function TextAreaField({
  label,
  icon,
  placeholder,
  value,
  onChange,
  required,
  maxLength = 2000,
  rows = 6
}) {
  const charCount = value.length;
  const isNearLimit = charCount > maxLength * 0.85;

  return (
    <div className="field">
      <label className="field__label">
        <span className="label-icon">{icon}</span>
        {label}
        {required && <span className="required">*</span>}
      </label>

      <motion.textarea
        className="field__textarea"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        rows={rows}
        whileFocus={{ scale: 1.002 }}
        transition={{ duration: 0.15 }}
      />

      <span className={`field__char-count${isNearLimit ? " field__char-count--warn" : ""}`}>
        {charCount} / {maxLength}
      </span>
    </div>
  );
}
