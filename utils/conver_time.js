export function convertExpiresInToMs(expiresIn) {
  const timeUnits = {
    s: 1000, // seconds
    m: 60 * 1000, // minutes
    h: 60 * 60 * 1000, // hours
    d: 24 * 60 * 60 * 1000, // days
  };

  // Default to infinite if expiresIn is not set
  if (!expiresIn) return null;

  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error("Invalid expiresIn format");

  const value = parseInt(match[1], 10); // Number part
  const unit = match[2]; // Time unit (s, m, h, d)

  return value * timeUnits[unit];
}
