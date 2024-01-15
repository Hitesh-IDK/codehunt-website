"use client";

import { PropsWithChildren, createContext } from "react";

export interface CoordinatorData {
  reference_id: number;
  location_name: string;
  code: string;
}

// export const LoginCtx = createContext<CoordinatorData>(
//   "" as unknown as CoordinatorData
// );

// export default function (props: PropsWithChildren): JSX.Element {
//   const [coordinatorData, setCoordinatorData] = ;

//   return <LoginCtx.Provider>{props.children}</LoginCtx.Provider>;
// }
