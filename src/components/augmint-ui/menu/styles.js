import { NavLink } from "react-router-dom";
import styled from "styled-components";
import theme from "styles/theme";
import { remCalc } from "styles/theme";
import { media } from "styles/media";

export const StyledMenu = styled.div`
    border-bottom: 1px solid ${theme.colors.white};
    color: ${theme.colors.white};
    display: flex;
    font-family: ${theme.typography.fontFamilies.default};
    font-size: ${remCalc(18)};
    font-weight: 400;
    line-height: ${remCalc(20)};
    margin-bottom: ${remCalc(14)};
    min-height: ${remCalc(50)};

    &.dashboardColor {
        border-bottom: 1px solid ${theme.colors.opacGrey};

        .dashblock__head & {
            margin-top: -10px;
        }
    }

    &.filled {
        border-bottom: none;
        margin-bottom: 20px;
    }
    &.upper {
        margin-bottom: 0;
        border-bottom: none;
        padding: 0 20px 20px 20px;
        ${media.mobile`
          padding: 0;
          width: 100%;
        `};
    }
`;

export const BaseMenuItem = styledComponent => styledComponent`
    align-items: center;
    white-space: nowrap;
    font-family: ${theme.typography.fontFamilies.title};
    color: ${theme.colors.white};
    cursor: pointer;
    line-height: ${remCalc(18)};
    text-align: center;
    width: auto;
    outline: none;

    ${media.mobileMin`
      padding: ${remCalc(16)} ${remCalc(16)};
      font-size: 18px;
    `};

    ${media.mobile`
      padding: ${remCalc(14)} 10px};
      font-size: 15px;
    `};


    &.filled {
      background-color: ${theme.colors.lightGrey};
      width: 50%;
      height: 60px;
      font-family: ${theme.typography.fontFamilies.default};
      text-align: center;
      padding-top: 20px;
      padding-bottom: 20px;
      box-sizing: border-box;
    }

    &.upper {
      width: 50%;
      height: 60px;
      font-family: ${theme.typography.fontFamilies.default};
      text-align: center;
      padding-top: 20px;
      padding-bottom: 20px;
      box-sizing: border-box;
    }


    &.active {
      color: ${theme.colors.opacBlack};
      background-color: ${theme.colors.white};
      border-radius: ${theme.borderRadius.top};
    }

    .App & {
        color: ${theme.colors.mediumGrey};

        &:hover {
          color: ${theme.colors.black};
        }

        &.active {
          margin-bottom: -1px;
          background-color: ${theme.colors.white};
          border-radius: 0;
          border-bottom: 5px solid ${theme.colors.secondary}
          color: ${theme.colors.black};

          &.filled {
            background-color: ${theme.colors.secondary};
            border-bottom: none;
            margin-bottom: 0;
          }
          &.filled.dark {
            background-color: ${theme.colors.primary};
            color: white;
          }
        }

        &.filled {
            padding: 20px 10px;
        }

        &.filled:first-of-type {
          border-radius: 4px 0 0 4px;
        }

        &.filled:last-of-type {
          border-radius: 0 4px 4px 0;
        }
    }
`;

export const StyledMenuItem = BaseMenuItem(styled.a);
export const StyledMenuItemNav = BaseMenuItem(styled(NavLink));
