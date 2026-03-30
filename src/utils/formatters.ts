export const formatVnd = (value: number): string =>
  `${new Intl.NumberFormat("vi-VN").format(value)}đ`;

export const formatDateTime = (isoDate: string): string =>
  new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(isoDate));
