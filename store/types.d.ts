export type Nullable<T> = T | null;

export type NavigationType = {
  navigate: (e?: string, params?: { [key: string]: string }) => void;
  goBack: () => void;
  addListener: (name: string, e: any) => void;
};
