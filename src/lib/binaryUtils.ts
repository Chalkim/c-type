/**
 * Utility functions for binary and data type conversions
 */

export const binaryToBigInt = (bits: number[]): bigint => {
  return BigInt('0b' + bits.join(''));
};

export const bigIntToBinary = (value: bigint, bitCount: number): number[] => {
  let binary = value.toString(2);
  if (binary.startsWith('-')) {
    // Handle negative numbers (2's complement)
    const positiveValue = BigInt(1) << BigInt(bitCount);
    binary = (positiveValue + value).toString(2);
  }
  return binary.padStart(bitCount, '0').split('').map(Number).slice(-bitCount);
};

export const getSignedValue = (bits: number[]): bigint => {
  if (bits.length === 0) return 0n;
  const isNegative = bits[0] === 1;
  const unsignedValue = binaryToBigInt(bits);
  if (isNegative) {
    const bitCount = bits.length;
    return unsignedValue - (1n << BigInt(bitCount));
  }
  return unsignedValue;
};

export const formatHex = (bits: number[]): string => {
  const binary = bits.join('');
  let hex = '';
  for (let i = 0; i < binary.length; i += 4) {
    const chunk = binary.slice(i, i + 4);
    hex += parseInt(chunk, 2).toString(16).toUpperCase();
  }
  return '0x' + hex;
};

// IEEE 754 Float32 (1 sign, 8 exponent, 23 fraction)
export const float32ToBinary = (value: number): number[] => {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setFloat32(0, value);
  const bits: number[] = [];
  for (let i = 0; i < 4; i++) {
    const byte = view.getUint8(i);
    for (let j = 7; j >= 0; j--) {
      bits.push((byte >> j) & 1);
    }
  }
  return bits;
};

export const binaryToFloat32 = (bits: number[]): number => {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  for (let i = 0; i < 4; i++) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | bits[i * 8 + j];
    }
    view.setUint8(i, byte);
  }
  return view.getFloat32(0);
};

// IEEE 754 Float64 (1 sign, 11 exponent, 52 fraction)
export const float64ToBinary = (value: number): number[] => {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setFloat64(0, value);
  const bits: number[] = [];
  for (let i = 0; i < 8; i++) {
    const byte = view.getUint8(i);
    for (let j = 7; j >= 0; j--) {
      bits.push((byte >> j) & 1);
    }
  }
  return bits;
};

export const binaryToFloat64 = (bits: number[]): number => {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  for (let i = 0; i < 8; i++) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | bits[i * 8 + j];
    }
    view.setUint8(i, byte);
  }
  return view.getFloat64(0);
};
