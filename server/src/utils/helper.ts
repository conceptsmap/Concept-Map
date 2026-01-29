export function generateOTP(): string {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }

  return otp;
}

export function hasOtpExpired(updatedAt: string): boolean {
  const otpUpdatedAt = new Date(updatedAt);

  const currentTime = new Date();

  const timeDifferenceInMs = currentTime.getTime() - otpUpdatedAt.getTime();
  const oneHourInMs = 60 * 60 * 1000;

  return timeDifferenceInMs > oneHourInMs;
}
