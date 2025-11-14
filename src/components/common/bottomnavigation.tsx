"use client";

import styled from "@emotion/styled";
import color from "@/packages/design-system/color";
import { useRouter } from "next/navigation";
import { Folder, HomePlus, User } from "../../../public/svg";

export default function BottomNavigationBar() {
  const router = useRouter();
  return (
    <BottomNavigation>
      <NavItem>
        <Folder width={48} height={48} onClick={() => router.push("/manage")} />
      </NavItem>
      <NavItem>
        <HomePlus width={48} height={48} onClick={() => router.push("/stage")} />
      </NavItem>
      <NavItem>
        <User width={48} height={48} />
      </NavItem>
    </BottomNavigation>
  );
}


const BottomNavigation = styled.div`
  background-color: ${color.form};
  border-top: 1px solid ${color.stroke_lighter};
  height: 64px;
  width: 100%;
  max-width: 475px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 64px;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom);
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 999999px;
  padding: 6px;
`;
