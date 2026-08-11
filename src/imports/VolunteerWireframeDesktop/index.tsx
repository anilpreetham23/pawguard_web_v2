function Heading() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[16px] relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[40px] text-center tracking-[-0.8px] whitespace-nowrap">
        <p className="leading-[48px]">{`Make a Difference: Volunteer & Foster`}</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#e5e5e5] content-stretch flex flex-col items-center justify-center px-[18px] py-[10px] relative shrink-0" data-name="Button">
      <div aria-hidden className="absolute border-2 border-[#525252] border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Start Application</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[18px] py-[10px] relative shrink-0" data-name="Button">
      <div aria-hidden className="absolute border-2 border-[#525252] border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Learn More</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[24px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function Container() {
  return (
    <div className="max-w-[768px] relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-center max-w-[inherit] relative size-full">
        <Heading />
        <div className="bg-[#d4d4d4] h-[16px] relative shrink-0 w-full" data-name="Background" />
        <div className="bg-[#d4d4d4] h-[16px] relative shrink-0 w-[588.8px]" data-name="Background" />
        <div className="bg-[#d4d4d4] h-[16px] relative shrink-0 w-[471.03px]" data-name="Background" />
        <Container1 />
      </div>
    </div>
  );
}

function SectionHeroWhyVolunteer() {
  return (
    <div className="bg-[#f5f5f5] min-h-[320px] relative shrink-0 w-full" data-name="Section - Hero: Why Volunteer">
      <div aria-hidden className="absolute border-[#ccc] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-center justify-center min-h-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center justify-center min-h-[inherit] pb-[66.5px] pt-[65.5px] px-[48px] relative size-full">
          <Container />
        </div>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[24px] text-center whitespace-nowrap">
        <p className="leading-[32px]">Ways You Can Help</p>
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[4px] relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[24px] w-full">
        <p className="leading-[32px]">Foster Care</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start pb-[8px] relative size-full">
        <Heading2 />
        <div className="bg-[#d4d4d4] h-[16px] relative shrink-0 w-full" data-name="Background" />
        <div className="bg-[#d4d4d4] h-[16px] relative shrink-0 w-[714.38px]" data-name="Background" />
        <div className="bg-[#d4d4d4] h-[16px] relative shrink-0 w-[584.48px]" data-name="Background" />
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[18px] py-[10px] relative shrink-0" data-name="Button">
      <div aria-hidden className="absolute border-2 border-[#525252] border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Foster Details</p>
      </div>
    </div>
  );
}

function ButtonMargin() {
  return (
    <div className="relative shrink-0" data-name="Button:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[24px] relative size-full">
        <Button2 />
      </div>
    </div>
  );
}

function FosterRoleLargeCard() {
  return (
    <div className="bg-[#e5e5e5] col-[1/span_8] content-stretch flex flex-col items-start justify-between justify-self-stretch min-h-[300px] p-px relative row-1 self-start shrink-0" data-name="Foster Role (Large Card)">
      <div aria-hidden className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none" />
      <Container3 />
      <ButtonMargin />
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[4px] relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[24px] w-full">
        <p className="leading-[32px]">Transport</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start pb-[8px] relative size-full">
        <Heading3 />
        <div className="bg-[#d4d4d4] h-[16px] relative shrink-0 w-full" data-name="Background" />
        <div className="bg-[#d4d4d4] h-[16px] relative shrink-0 w-[301.33px]" data-name="Background" />
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[18px] py-[10px] relative shrink-0" data-name="Button">
      <div aria-hidden className="absolute border-2 border-[#525252] border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Driver Info</p>
      </div>
    </div>
  );
}

function ButtonMargin1() {
  return (
    <div className="relative shrink-0" data-name="Button:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[24px] relative size-full">
        <Button3 />
      </div>
    </div>
  );
}

function TransportRoleSmallCard() {
  return (
    <div className="bg-[#e5e5e5] col-[9/span_4] content-stretch flex flex-col items-start justify-between justify-self-stretch min-h-[300px] p-px relative row-1 self-start shrink-0" data-name="Transport Role (Small Card)">
      <div aria-hidden className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none" />
      <Container4 />
      <ButtonMargin1 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[4px] relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[24px] w-full">
        <p className="leading-[32px]">{`Events & Outreach`}</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start pb-[8px] relative size-full">
        <Heading4 />
        <div className="bg-[#d4d4d4] h-[16px] relative shrink-0 w-full" data-name="Background" />
        <div className="bg-[#d4d4d4] h-[16px] relative shrink-0 w-[433.5px]" data-name="Background" />
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[18px] py-[10px] relative shrink-0" data-name="Button">
      <div aria-hidden className="absolute border-2 border-[#525252] border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Event Calendar</p>
      </div>
    </div>
  );
}

function ButtonMargin2() {
  return (
    <div className="relative shrink-0" data-name="Button:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[24px] relative size-full">
        <Button4 />
      </div>
    </div>
  );
}

function EventsRoleMediumCard() {
  return (
    <div className="bg-[#e5e5e5] col-[1/span_6] content-stretch flex flex-col items-start justify-between justify-self-stretch min-h-[250px] p-px relative row-2 self-start shrink-0" data-name="Events Role (Medium Card)">
      <div aria-hidden className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none" />
      <Container5 />
      <ButtonMargin2 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[4px] relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[24px] w-full">
        <p className="leading-[32px]">Shelter Support</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start pb-[8px] relative size-full">
        <Heading5 />
        <div className="bg-[#d4d4d4] h-[16px] relative shrink-0 w-full" data-name="Background" />
        <div className="bg-[#d4d4d4] h-[16px] relative shrink-0 w-[481.66px]" data-name="Background" />
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[18px] py-[10px] relative shrink-0" data-name="Button">
      <div aria-hidden className="absolute border-2 border-[#525252] border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Support Roles</p>
      </div>
    </div>
  );
}

function ButtonMargin3() {
  return (
    <div className="relative shrink-0" data-name="Button:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[24px] relative size-full">
        <Button5 />
      </div>
    </div>
  );
}

function ShelterSupportMediumCard() {
  return (
    <div className="bg-[#e5e5e5] col-[7/span_6] content-stretch flex flex-col items-start justify-between justify-self-stretch min-h-[250px] p-px relative row-2 self-start shrink-0" data-name="Shelter Support (Medium Card)">
      <div aria-hidden className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none" />
      <Container6 />
      <ButtonMargin3 />
    </div>
  );
}

function Container2() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(12,minmax(0,1fr))] grid-rows-[__300px_250px] relative shrink-0 w-full" data-name="Container">
      <FosterRoleLargeCard />
      <TransportRoleSmallCard />
      <EventsRoleMediumCard />
      <ShelterSupportMediumCard />
    </div>
  );
}

function RoleDefinitionSectionBentoIshGrid() {
  return (
    <div className="relative shrink-0 w-full" data-name="Role Definition Section (Bento-ish Grid)">
      <div className="content-stretch flex flex-col items-start px-[48px] py-[64px] relative size-full">
        <Heading1 />
        <Container2 />
      </div>
    </div>
  );
}

function Heading6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[24px] w-full">
        <p className="leading-[32px]">General Requirements</p>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col h-[28px] items-start pt-[4px] relative shrink-0 w-[24px]" data-name="Margin">
      <div className="relative shrink-0 size-[24px]" data-name="Border">
        <div aria-hidden className="absolute border border-[#525252] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Age Restriction</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start pb-[8px] relative shrink-0 w-[115.11px]" data-name="Container">
      <Container11 />
      <div className="bg-[#d4d4d4] h-[16px] relative shrink-0 w-full" data-name="Background" />
    </div>
  );
}

function Container9() {
  return (
    <div className="col-1 content-stretch flex gap-[12px] h-[52px] items-start justify-self-stretch relative row-1 shrink-0" data-name="Container">
      <Margin />
      <Container10 />
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col h-[28px] items-start pt-[4px] relative shrink-0 w-[24px]" data-name="Margin">
      <div className="relative shrink-0 size-[24px]" data-name="Border">
        <div aria-hidden className="absolute border border-[#525252] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Time Commitment</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start pb-[8px] relative shrink-0 w-[138.5px]" data-name="Container">
      <Container14 />
      <div className="bg-[#d4d4d4] h-[16px] relative shrink-0 w-full" data-name="Background" />
    </div>
  );
}

function Container12() {
  return (
    <div className="col-2 content-stretch flex gap-[12px] h-[52px] items-start justify-self-stretch relative row-1 shrink-0" data-name="Container">
      <Margin1 />
      <Container13 />
    </div>
  );
}

function Margin2() {
  return (
    <div className="content-stretch flex flex-col h-[28px] items-start pt-[4px] relative shrink-0 w-[24px]" data-name="Margin">
      <div className="relative shrink-0 size-[24px]" data-name="Border">
        <div aria-hidden className="absolute border border-[#525252] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Background Check</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start pb-[8px] relative shrink-0 w-[143.8px]" data-name="Container">
      <Container17 />
      <div className="bg-[#d4d4d4] h-[16px] relative shrink-0 w-full" data-name="Background" />
    </div>
  );
}

function Container15() {
  return (
    <div className="col-1 content-stretch flex gap-[12px] h-[52px] items-start justify-self-stretch relative row-2 shrink-0" data-name="Container">
      <Margin2 />
      <Container16 />
    </div>
  );
}

function Margin3() {
  return (
    <div className="content-stretch flex flex-col h-[28px] items-start pt-[4px] relative shrink-0 w-[24px]" data-name="Margin">
      <div className="relative shrink-0 size-[24px]" data-name="Border">
        <div aria-hidden className="absolute border border-[#525252] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Training Session</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start pb-[8px] relative shrink-0 w-[124.81px]" data-name="Container">
      <Container20 />
      <div className="bg-[#d4d4d4] h-[16px] relative shrink-0 w-full" data-name="Background" />
    </div>
  );
}

function Container18() {
  return (
    <div className="col-2 content-stretch flex gap-[12px] h-[52px] items-start justify-self-stretch relative row-2 shrink-0" data-name="Container">
      <Margin3 />
      <Container19 />
    </div>
  );
}

function Container8() {
  return (
    <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[__52px_52px] relative shrink-0 w-full" data-name="Container">
      <Container9 />
      <Container12 />
      <Container15 />
      <Container18 />
    </div>
  );
}

function Container7() {
  return (
    <div className="max-w-[896px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start max-w-[inherit] relative size-full">
        <Heading6 />
        <Container8 />
      </div>
    </div>
  );
}

function SectionRequirementChecklist() {
  return (
    <div className="bg-[#f5f5f5] relative shrink-0 w-full" data-name="Section - Requirement Checklist">
      <div aria-hidden className="absolute border-[#ccc] border-b border-solid border-t inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start px-[192px] py-[65px] relative size-full">
        <Container7 />
      </div>
    </div>
  );
}

function Heading7() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[24px] text-center whitespace-nowrap">
        <p className="leading-[32px]">Application Process</p>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center p-[2px] relative rounded-[9999px] shrink-0 size-[48px]" data-name="Background+Border">
      <div aria-hidden className="absolute border-2 border-[#171717] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">1</p>
      </div>
    </div>
  );
}

function Margin4() {
  return (
    <div className="content-stretch flex flex-col h-[60px] items-start pb-[12px] relative shrink-0 w-[48px] z-[2]" data-name="Margin">
      <BackgroundBorder />
    </div>
  );
}

function Step() {
  return (
    <div className="bg-white content-stretch flex flex-col isolate items-center p-[12px] relative shrink-0" data-name="Step 1">
      <Margin4 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[16px] text-center whitespace-nowrap z-[1]">
        <p className="leading-[24px]">Create Profile</p>
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center p-[2px] relative rounded-[9999px] shrink-0 size-[48px]" data-name="Background+Border">
      <div aria-hidden className="absolute border-2 border-[#a3a3a3] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#a3a3a3] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">2</p>
      </div>
    </div>
  );
}

function Margin5() {
  return (
    <div className="content-stretch flex flex-col h-[60px] items-start pb-[12px] relative shrink-0 w-[48px] z-[2]" data-name="Margin">
      <BackgroundBorder1 />
    </div>
  );
}

function Step1() {
  return (
    <div className="bg-white content-stretch flex flex-col isolate items-center p-[12px] relative shrink-0" data-name="Step 2">
      <Margin5 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#525252] text-[16px] text-center whitespace-nowrap z-[1]">
        <p className="leading-[24px]">Select Role</p>
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center p-[2px] relative rounded-[9999px] shrink-0 size-[48px]" data-name="Background+Border">
      <div aria-hidden className="absolute border-2 border-[#a3a3a3] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#a3a3a3] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">3</p>
      </div>
    </div>
  );
}

function Margin6() {
  return (
    <div className="content-stretch flex flex-col h-[60px] items-start pb-[12px] relative shrink-0 w-[48px] z-[2]" data-name="Margin">
      <BackgroundBorder2 />
    </div>
  );
}

function Step2() {
  return (
    <div className="bg-white content-stretch flex flex-col isolate items-center p-[12px] relative shrink-0" data-name="Step 3">
      <Margin6 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#525252] text-[16px] text-center whitespace-nowrap z-[1]">
        <p className="leading-[24px]">Orientation</p>
      </div>
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center p-[2px] relative rounded-[9999px] shrink-0 size-[48px]" data-name="Background+Border">
      <div aria-hidden className="absolute border-2 border-[#a3a3a3] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#a3a3a3] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">4</p>
      </div>
    </div>
  );
}

function Margin7() {
  return (
    <div className="content-stretch flex flex-col h-[60px] items-start pb-[12px] relative shrink-0 w-[48px] z-[2]" data-name="Margin">
      <BackgroundBorder3 />
    </div>
  );
}

function Step3() {
  return (
    <div className="bg-white content-stretch flex flex-col isolate items-center p-[12px] relative shrink-0" data-name="Step 4">
      <Margin7 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#525252] text-[16px] text-center whitespace-nowrap z-[1]">
        <p className="leading-[24px]">Start Helping</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <div className="-translate-y-1/2 absolute bg-[#d4d4d4] h-[2px] left-0 right-0 top-1/2" data-name="Connecting Line" />
      <Step />
      <Step1 />
      <Step2 />
      <Step3 />
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#171717] content-stretch flex items-center justify-center px-[66px] py-[14px] relative shrink-0" data-name="Button">
      <div aria-hidden className="absolute border-2 border-[#171717] border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
        <p className="leading-[24px]">Begin Application Now</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <Button6 />
    </div>
  );
}

function SectionMultiStepApplicationFlowTeaser() {
  return (
    <div className="content-stretch flex flex-col gap-[64px] items-start max-w-[1024px] pt-[64px] relative shrink-0 w-[1024px]" data-name="Section - Multi-step Application Flow Teaser">
      <Heading7 />
      <Container21 />
      <Container22 />
    </div>
  );
}

function Main() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-0 pb-[64px] right-0 top-[61px]" data-name="Main">
      <SectionHeroWhyVolunteer />
      <RoleDefinitionSectionBentoIshGrid />
      <SectionRequirementChecklist />
      <SectionMultiStepApplicationFlowTeaser />
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[24px] w-full">
        <p className="leading-[32px]">RescueLink</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#525252] text-[16px] w-full">
        <p className="leading-[24px] mb-0">© 2024 Animal Welfare Public</p>
        <p className="leading-[24px]">Service Platform. All rights reserved.</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="col-1 justify-self-stretch relative row-1 self-start shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start pb-[12px] relative size-full">
        <Container24 />
        <Container25 />
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#525252] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Privacy Policy</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#525252] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Terms of Service</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#525252] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Accessibility Statement</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#525252] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Community Guidelines</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#525252] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Contact Us</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="col-[2/span_3] h-[116px] justify-self-stretch relative row-1 shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-end relative size-full">
        <Link />
        <Link1 />
        <Link2 />
        <Link3 />
        <Link4 />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-[#f5f5f5] relative shrink-0 w-full" data-name="Footer">
      <div aria-hidden className="absolute border-[#ccc] border-solid border-t inset-0 pointer-events-none" />
      <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[_116px] pb-[64px] pt-[65px] px-[48px] relative size-full">
        <Container23 />
        <Container26 />
      </div>
    </div>
  );
}

function FooterMargin() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[64px] right-0 top-[1829px]" data-name="Footer:margin">
      <Footer />
    </div>
  );
}

function Container27() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[24px] whitespace-nowrap">
          <p className="leading-[32px]">RescueLink</p>
        </div>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#525252] text-[14px] tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Find Pets</p>
      </div>
    </div>
  );
}

function Link6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#525252] text-[14px] tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Services</p>
      </div>
    </div>
  );
}

function Link7() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[6px] relative shrink-0" data-name="Link">
      <div aria-hidden className="absolute border-[#171717] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[14px] tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Volunteer</p>
      </div>
    </div>
  );
}

function Link8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#525252] text-[14px] tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Donate</p>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="relative shrink-0" data-name="Nav">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-center relative size-full">
        <Link5 />
        <Link6 />
        <Link7 />
        <Link8 />
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[12px] whitespace-nowrap">
          <p className="leading-[16px]">USR</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder4() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center p-px relative rounded-[9999px] shrink-0 size-[32px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Container29 />
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[12px] whitespace-nowrap">
          <p className="leading-[16px]">NOT</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder5() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[32px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container30 />
    </div>
  );
}

function Button7() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[18px] py-[10px] relative shrink-0" data-name="Button">
      <div aria-hidden className="absolute border-2 border-[#525252] border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Report Emergency</p>
      </div>
    </div>
  );
}

function ButtonMargin4() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[12px] relative shrink-0" data-name="Button:margin">
      <Button7 />
    </div>
  );
}

function Container28() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <BackgroundBorder4 />
        <BackgroundBorder5 />
        <ButtonMargin4 />
      </div>
    </div>
  );
}

function HeaderTopAppBar() {
  return (
    <div className="absolute bg-white content-stretch flex items-center justify-between left-0 pb-[9px] pt-[8px] px-[48px] right-0 top-0" data-name="Header - TopAppBar">
      <div aria-hidden className="absolute border-[#ccc] border-b border-solid inset-0 pointer-events-none" />
      <Container27 />
      <Nav />
      <Container28 />
    </div>
  );
}

export default function VolunteerWireframeDesktop() {
  return (
    <div className="bg-white relative size-full" data-name="Volunteer Wireframe (Desktop)">
      <Main />
      <FooterMargin />
      <HeaderTopAppBar />
    </div>
  );
}