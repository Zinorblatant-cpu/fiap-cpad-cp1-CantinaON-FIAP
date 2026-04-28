import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function ActionButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
}) {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        disabled && styles.disabled,
      ]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Text
        style={[
          styles.label,
          isPrimary ? styles.primaryLabel : styles.secondaryLabel,
          disabled && styles.disabledLabel,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primary: {
    backgroundColor: '#E3000B',
  },
  secondary: {
    borderWidth: 1,
    borderColor: '#E3000B',
    backgroundColor: '#111111',
  },
  disabled: {
    backgroundColor: '#333333',
    borderColor: '#333333',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryLabel: {
    color: '#FFFFFF',
  },
  secondaryLabel: {
    color: '#E3000B',
  },
  disabledLabel: {
    color: '#666666',
  },
});
