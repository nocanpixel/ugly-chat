import { styled } from 'styled-components';


export const LayoutSection = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 100%;
    height: 100vh;
`

export const LayoutContainer = styled.div`
    min-width: 90%;
    background-color: white;
    border-radius: 20px;
    overflow: hidden;

    @media (min-width: 600px) {
        min-width: 360px;
    }
`

export const LayoutHeader = styled.div`
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: end;
    padding: 0 12px 0 12px;
`

export const LayoutBody = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 88vh;
    padding: 0px 12px 0px 12px;
`

export const LoginSection = styled.section`
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 3em;
    min-height: 88vh;
    padding: 0px 12px 0px 12px;
`