function Heading() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[40px] text-black text-center tracking-[-0.8px] whitespace-nowrap">
        <p className="leading-[48px]">{`Our Mission & Vision`}</p>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#ccc] content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-[transparent] text-center whitespace-nowrap">
        <p className="leading-[28px]">We strive to create a world where every animal is valued and protected.</p>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#ccc] content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-[transparent] text-center whitespace-nowrap">
        <p className="leading-[28px]">Our vision is a comprehensive support system bridging communities</p>
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#ccc] content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-[transparent] text-center whitespace-nowrap">
        <p className="leading-[28px]">and essential resources to ensure comprehensive welfare.</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Background />
      <Background1 />
      <Background2 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col h-[19.5px] items-center relative shrink-0 w-[39px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#888] text-[13px] text-center whitespace-nowrap">
        <p className="leading-[19.5px]">IMAGE</p>
      </div>
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#d0d0d0] content-stretch flex h-[256px] items-center justify-center relative rounded-[2px] shrink-0 w-full" data-name="Background">
      <Container1 />
    </div>
  );
}

function SectionMissionVisionStatement() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start max-w-[768px] relative shrink-0 w-[768px]" data-name="Section - Mission/Vision Statement">
      <Heading />
      <Container />
      <Background3 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[13px] relative shrink-0 w-full" data-name="Heading 2">
      <div aria-hidden className="absolute border-[#ccc] border-b border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[30px] text-black tracking-[-0.3px] whitespace-nowrap">
        <p className="leading-[38px]">Impact Metrics</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[40px] text-black text-center tracking-[-0.8px] whitespace-nowrap">
        <p className="leading-[48px]">XXXX</p>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="relative shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] relative size-full">
        <Container3 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[14px] text-center tracking-[0.7px] uppercase whitespace-nowrap">
          <p className="leading-[20px]">ANIMALS RESCUED</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#e0e0e0] flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center p-[25px] relative size-full">
          <Margin />
          <Container4 />
        </div>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[40px] text-black text-center tracking-[-0.8px] whitespace-nowrap">
        <p className="leading-[48px]">XXXX</p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="relative shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] relative size-full">
        <Container5 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[14px] text-center tracking-[0.7px] uppercase whitespace-nowrap">
          <p className="leading-[20px]">VOLUNTEERS ACTIVE</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#e0e0e0] flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center p-[25px] relative size-full">
          <Margin1 />
          <Container6 />
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[40px] text-black text-center tracking-[-0.8px] whitespace-nowrap">
        <p className="leading-[48px]">XXXX</p>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="relative shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] relative size-full">
        <Container7 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[14px] text-center tracking-[0.7px] uppercase whitespace-nowrap">
          <p className="leading-[20px]">SERVICES PROVIDED</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-[#e0e0e0] flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center p-[25px] relative size-full">
          <Margin2 />
          <Container8 />
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[40px] text-black text-center tracking-[-0.8px] whitespace-nowrap">
        <p className="leading-[48px]">XXXX</p>
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div className="relative shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] relative size-full">
        <Container9 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[14px] text-center tracking-[0.7px] uppercase whitespace-nowrap">
          <p className="leading-[20px]">COMMUNITIES REACHED</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="bg-[#e0e0e0] flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center p-[25px] relative size-full">
          <Margin3 />
          <Container10 />
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[24px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <BackgroundBorder />
      <BackgroundBorder1 />
      <BackgroundBorder2 />
      <BackgroundBorder3 />
    </div>
  );
}

function SectionDetailedImpactMetricsGrid() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Section - Detailed Impact Metrics Grid">
      <Heading1 />
      <Container2 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[30px] text-black tracking-[-0.3px] w-full">
        <p className="leading-[38px]">Operational Transparency</p>
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black w-full">
        <p className="leading-[32px]">Financial Accountability</p>
      </div>
    </div>
  );
}

function Background4() {
  return (
    <div className="bg-[#ccc] content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[transparent] whitespace-nowrap">
        <p className="leading-[24px]">Detailed breakdown of fund allocation</p>
      </div>
    </div>
  );
}

function Background5() {
  return (
    <div className="bg-[#ccc] content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[transparent] whitespace-nowrap">
        <p className="leading-[24px]">ensuring 90% goes directly to</p>
      </div>
    </div>
  );
}

function Background6() {
  return (
    <div className="bg-[#ccc] content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[transparent] whitespace-nowrap">
        <p className="leading-[24px]">animal care and rescue operations.</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Container">
      <Background4 />
      <Background5 />
      <Background6 />
    </div>
  );
}

function Container14() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">CHART PLACEHOLDER</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder4() {
  return (
    <div className="bg-[#e0e0e0] content-stretch flex h-[172px] items-center justify-center pb-px pt-[13px] px-px relative rounded-[2px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <Container14 />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px relative" data-name="Container">
      <Heading3 />
      <Container13 />
      <BackgroundBorder4 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black w-full">
        <p className="leading-[32px]">Governance Structure</p>
      </div>
    </div>
  );
}

function Background7() {
  return (
    <div className="bg-[#ccc] h-[17px] relative shrink-0 w-[203.05px]" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] left-0 not-italic text-[16px] text-[transparent] top-[8.5px] whitespace-nowrap">
          <p className="leading-[24px]">Independent Board of Directors</p>
        </div>
      </div>
    </div>
  );
}

function Item() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[9px] pt-[3px] relative shrink-0 w-full" data-name="Item">
      <div aria-hidden className="absolute border-[#ccc] border-b border-solid inset-0 pointer-events-none" />
      <Background7 />
    </div>
  );
}

function Background8() {
  return (
    <div className="bg-[#ccc] h-[17px] relative shrink-0 w-[151.98px]" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] left-0 not-italic text-[16px] text-[transparent] top-[8.5px] whitespace-nowrap">
          <p className="leading-[24px]">Quarterly Public Audits</p>
        </div>
      </div>
    </div>
  );
}

function Item1() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[9px] pt-[3px] relative shrink-0 w-full" data-name="Item">
      <div aria-hidden className="absolute border-[#ccc] border-b border-solid inset-0 pointer-events-none" />
      <Background8 />
    </div>
  );
}

function Background9() {
  return (
    <div className="bg-[#ccc] h-[17px] relative shrink-0 w-[157.31px]" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] left-0 not-italic text-[16px] text-[transparent] top-[8.5px] whitespace-nowrap">
          <p className="leading-[24px]">Open Policy Framework</p>
        </div>
      </div>
    </div>
  );
}

function Item2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[9px] pt-[3px] relative shrink-0 w-full" data-name="Item">
      <div aria-hidden className="absolute border-[#ccc] border-b border-solid inset-0 pointer-events-none" />
      <Background9 />
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="List">
      <Item />
      <Item1 />
      <Item2 />
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px pb-[153px] relative" data-name="Container">
      <Heading4 />
      <List />
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex gap-[64px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container12 />
      <Container15 />
    </div>
  );
}

function OperationalTransparencySection() {
  return (
    <div className="bg-[#eee] relative rounded-[8px] shrink-0 w-full" data-name="Operational Transparency Section">
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[40px] relative size-full">
        <Heading2 />
        <Container11 />
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[13px] relative shrink-0 w-full" data-name="Heading 2">
      <div aria-hidden className="absolute border-[#ccc] border-b border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[30px] text-black tracking-[-0.3px] whitespace-nowrap">
        <p className="leading-[38px]">Leadership Team</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col h-[19.5px] items-start relative shrink-0 w-[39px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#888] text-[13px] whitespace-nowrap">
        <p className="leading-[19.5px]">IMAGE</p>
      </div>
    </div>
  );
}

function Background10() {
  return (
    <div className="bg-[#d0d0d0] content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[128px]" data-name="Background">
      <Container17 />
    </div>
  );
}

function Margin4() {
  return (
    <div className="content-stretch flex flex-col h-[140px] items-start pb-[12px] relative shrink-0 w-[128px]" data-name="Margin">
      <Background10 />
    </div>
  );
}

function Margin5() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[4px] relative shrink-0" data-name="Margin">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Name Placeholder</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Role Title</p>
      </div>
    </div>
  );
}

function TeamMember() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-center min-w-px relative" data-name="Team Member">
      <Margin4 />
      <Margin5 />
      <Container18 />
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col h-[19.5px] items-start relative shrink-0 w-[39px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#888] text-[13px] whitespace-nowrap">
        <p className="leading-[19.5px]">IMAGE</p>
      </div>
    </div>
  );
}

function Background11() {
  return (
    <div className="bg-[#d0d0d0] content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[128px]" data-name="Background">
      <Container19 />
    </div>
  );
}

function Margin6() {
  return (
    <div className="content-stretch flex flex-col h-[140px] items-start pb-[12px] relative shrink-0 w-[128px]" data-name="Margin">
      <Background11 />
    </div>
  );
}

function Margin7() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[4px] relative shrink-0" data-name="Margin">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Name Placeholder</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Role Title</p>
      </div>
    </div>
  );
}

function TeamMember1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-center min-w-px relative" data-name="Team Member">
      <Margin6 />
      <Margin7 />
      <Container20 />
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col h-[19.5px] items-start relative shrink-0 w-[39px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#888] text-[13px] whitespace-nowrap">
        <p className="leading-[19.5px]">IMAGE</p>
      </div>
    </div>
  );
}

function Background12() {
  return (
    <div className="bg-[#d0d0d0] content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[128px]" data-name="Background">
      <Container21 />
    </div>
  );
}

function Margin8() {
  return (
    <div className="content-stretch flex flex-col h-[140px] items-start pb-[12px] relative shrink-0 w-[128px]" data-name="Margin">
      <Background12 />
    </div>
  );
}

function Margin9() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[4px] relative shrink-0" data-name="Margin">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Name Placeholder</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Role Title</p>
      </div>
    </div>
  );
}

function TeamMember2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-center min-w-px relative" data-name="Team Member">
      <Margin8 />
      <Margin9 />
      <Container22 />
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col h-[19.5px] items-start relative shrink-0 w-[39px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#888] text-[13px] whitespace-nowrap">
        <p className="leading-[19.5px]">IMAGE</p>
      </div>
    </div>
  );
}

function Background13() {
  return (
    <div className="bg-[#d0d0d0] content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[128px]" data-name="Background">
      <Container23 />
    </div>
  );
}

function Margin10() {
  return (
    <div className="content-stretch flex flex-col h-[140px] items-start pb-[12px] relative shrink-0 w-[128px]" data-name="Margin">
      <Background13 />
    </div>
  );
}

function Margin11() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[4px] relative shrink-0" data-name="Margin">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Name Placeholder</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Role Title</p>
      </div>
    </div>
  );
}

function TeamMember3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-center min-w-px relative" data-name="Team Member">
      <Margin10 />
      <Margin11 />
      <Container24 />
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex gap-[24px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <TeamMember />
      <TeamMember1 />
      <TeamMember2 />
      <TeamMember3 />
    </div>
  );
}

function SectionTeamPlaceholderGrid() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Section - Team Placeholder Grid">
      <Heading5 />
      <Container16 />
    </div>
  );
}

function Main() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[64px] items-center left-0 max-w-[1440px] pb-[128px] pt-[64px] px-[48px] right-0 top-[55px]" data-name="Main">
      <SectionMissionVisionStatement />
      <SectionDetailedImpactMetricsGrid />
      <OperationalTransparencySection />
      <SectionTeamPlaceholderGrid />
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black w-full">
        <p className="leading-[32px]">RescueLink</p>
      </div>
    </div>
  );
}

function Margin12() {
  return (
    <div className="col-[1/span_4] content-stretch flex flex-col items-start justify-self-stretch pb-[36px] relative row-1 self-start shrink-0" data-name="Margin">
      <Container26 />
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[14px] w-full">
        <p className="leading-[20px]">Privacy Policy</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[14px] w-full">
        <p className="leading-[20px]">Terms of Service</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[12px] items-start justify-self-stretch relative row-2 self-start shrink-0" data-name="Container">
      <Link />
      <Link1 />
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[14px] w-full">
        <p className="leading-[20px]">Accessibility Statement</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[14px] w-full">
        <p className="leading-[20px]">Community Guidelines</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="col-2 content-stretch flex flex-col gap-[12px] items-start justify-self-stretch relative row-2 self-start shrink-0" data-name="Container">
      <Link2 />
      <Link3 />
    </div>
  );
}

function Link4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[14px] w-full">
        <p className="leading-[20px]">Contact Us</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="col-3 content-stretch flex flex-col items-start justify-self-stretch pb-[32px] relative row-2 self-start shrink-0" data-name="Container">
      <Link4 />
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[14px] text-center whitespace-nowrap">
          <p className="leading-[20px]">© 2024 Animal Welfare Public Service Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[25px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[#ccc] border-solid border-t inset-0 pointer-events-none" />
      <Container30 />
    </div>
  );
}

function Margin13() {
  return (
    <div className="col-[1/span_4] content-stretch flex flex-col items-start justify-self-stretch pt-[40px] relative row-3 self-start shrink-0" data-name="Margin">
      <HorizontalBorder />
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[___68px_52px_85px] px-[48px] py-[64px] relative size-full">
        <Margin12 />
        <Container27 />
        <Container28 />
        <Container29 />
        <Margin13 />
      </div>
    </div>
  );
}

function GlobalFooter() {
  return (
    <div className="bg-[#eee] content-stretch flex flex-col items-start pt-px relative shrink-0 w-full" data-name="Global Footer">
      <div aria-hidden className="absolute border-[#ccc] border-solid border-t inset-0 pointer-events-none" />
      <Container25 />
    </div>
  );
}

function GlobalFooterMargin() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[64px] right-0 top-[1801px]" data-name="Global Footer:margin">
      <GlobalFooter />
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black whitespace-nowrap">
        <p className="leading-[32px]">RescueLink</p>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Find Pets</p>
      </div>
    </div>
  );
}

function Link6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Services</p>
      </div>
    </div>
  );
}

function Link7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Volunteer</p>
      </div>
    </div>
  );
}

function Link8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Donate</p>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Nav">
      <Link5 />
      <Link6 />
      <Link7 />
      <Link8 />
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[25px] py-[9px] relative rounded-[2px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Report Emergency</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Container">
      <Button />
      <div className="bg-[#999] relative rounded-[12px] shrink-0 size-[24px]" data-name="Background" />
      <div className="bg-[#999] relative rounded-[12px] shrink-0 size-[24px]" data-name="Background" />
    </div>
  );
}

function Container31() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[48px] py-[8px] relative size-full">
          <Container32 />
          <Nav />
          <Container33 />
        </div>
      </div>
    </div>
  );
}

function HeaderTopAppBarNavigation() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-start left-0 pb-px right-0 top-0" data-name="Header - TopAppBar Navigation">
      <div aria-hidden className="absolute border-[#ccc] border-b border-solid inset-0 pointer-events-none" />
      <Container31 />
    </div>
  );
}

export default function AboutWireframeDesktop() {
  return (
    <div className="bg-white relative size-full" data-name="About Wireframe (Desktop)">
      <Main />
      <GlobalFooterMargin />
      <HeaderTopAppBarNavigation />
    </div>
  );
}