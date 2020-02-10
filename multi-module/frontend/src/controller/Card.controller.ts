export namespace card {
  export interface Props {
    title: string;
    evt: (e: React.MouseEvent) => void;
    value: number;
    btn: string;
    children: React.ReactElement[] | React.ReactElement;
  }
}
