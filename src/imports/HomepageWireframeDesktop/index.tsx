function Background() {
  return (
    <div className="bg-[#d1d5db] h-[48px] relative rounded-[2px] shrink-0 w-full" data-name="Background">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] left-0 not-italic text-[40px] text-[transparent] top-[47.5px] tracking-[-0.8px] whitespace-nowrap">
        <p className="leading-[48px] mb-0">Connecting</p>
        <p className="leading-[48px]">Compassion</p>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#d1d5db] content-stretch flex flex-col h-[48px] items-start relative rounded-[2px] shrink-0 w-[279.98px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[40px] text-[transparent] tracking-[-0.8px] whitespace-nowrap">
        <p className="leading-[48px]">With Action</p>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[420px]" data-name="Heading 1">
      <Background />
      <Background1 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start max-w-[512px] relative shrink-0 w-[512px]" data-name="Container">
      <div className="bg-[#d1d5db] h-[24px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
      <div className="bg-[#d1d5db] h-[24px] relative rounded-[2px] shrink-0 w-[426.66px]" data-name="Background" />
      <div className="bg-[#d1d5db] h-[24px] relative rounded-[2px] shrink-0 w-[341.33px]" data-name="Background" />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#00236f] content-stretch flex flex-col items-center justify-center pb-[13.5px] pt-[12.5px] px-[64px] relative rounded-[2px] shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Find a Pet</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[65px] py-[13px] relative rounded-[2px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#757682] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">View Services</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[12px] relative shrink-0 w-full" data-name="Margin">
      <Container2 />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px relative" data-name="Container">
      <Heading />
      <Container1 />
      <Margin />
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex flex-[1_0_0] items-center justify-center min-h-px p-px relative rounded-[8px] w-full" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[13px] text-center whitespace-nowrap">
        <p className="leading-[19.5px]">Hero Image Placeholder</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[400px] items-start justify-center min-w-px relative" data-name="Container">
      <BackgroundBorder />
    </div>
  );
}

function HeroSection() {
  return (
    <div className="content-stretch flex gap-[64px] items-center justify-center min-h-[500px] py-[50px] relative shrink-0 w-full" data-name="Hero Section">
      <Container />
      <Container3 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#93000a] text-[30px] tracking-[-0.3px] whitespace-nowrap">
        <p className="leading-[38px]">Emergency Rescue Protocol</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[672px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-[#d1d5db] h-[20px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
      <div className="bg-[#d1d5db] h-[20px] relative rounded-[2px] shrink-0 w-[299.42px]" data-name="Background" />
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0 w-[399.23px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative size-full">
        <Heading1 />
        <Container5 />
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#ba1a1a] relative rounded-[4px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[64px] py-[24px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.7px] whitespace-nowrap">
          <p className="leading-[20px]">Initiate Protocol</p>
        </div>
      </div>
    </div>
  );
}

function SectionEmergencyRescueCta() {
  return (
    <div className="bg-[#ffdad6] relative rounded-[8px] shrink-0 w-full" data-name="Section - Emergency Rescue CTA">
      <div aria-hidden className="absolute border border-[rgba(186,26,26,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[65px] relative size-full">
          <Container4 />
          <Button2 />
        </div>
      </div>
    </div>
  );
}

function SectionMissionStatement() {
  return (
    <div className="content-stretch flex flex-col items-center max-w-[768px] pb-[188px] pt-[64px] relative shrink-0 w-full" data-name="Section - Mission Statement">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[30px] text-center tracking-[-0.3px] whitespace-nowrap">
        <p className="leading-[38px]">Our Mission</p>
      </div>
    </div>
  );
}

function SectionMissionStatementMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Section - Mission Statement:margin">
      <div className="content-stretch flex flex-col items-start px-[506.719px] relative size-full">
        <SectionMissionStatement />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[30px] tracking-[-0.3px] w-full">
        <p className="leading-[38px]">Core Services</p>
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex items-center justify-center p-px relative rounded-[12px] shrink-0 size-[48px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[13px] text-center whitespace-nowrap">
        <p className="leading-[19.5px]">Icon</p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="h-[60px] relative shrink-0 w-[48px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] relative size-full">
        <BackgroundBorder1 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[24px] w-full">
          <p className="leading-[32px]">Adoption</p>
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <div className="bg-[#d1d5db] h-[16px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
        <div className="bg-[#d1d5db] h-[16px] relative rounded-[2px] shrink-0 w-[273.88px]" data-name="Background" />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-start p-[25px] relative rounded-[4px] shrink-0 w-[378.66px]" data-name="Card 1">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Margin1 />
      <Heading3 />
      <Container7 />
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex items-center justify-center p-px relative rounded-[12px] shrink-0 size-[48px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[13px] text-center whitespace-nowrap">
        <p className="leading-[19.5px]">Icon</p>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="h-[60px] relative shrink-0 w-[48px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] relative size-full">
        <BackgroundBorder2 />
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[24px] w-full">
          <p className="leading-[32px]">Fostering</p>
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <div className="bg-[#d1d5db] h-[16px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
        <div className="bg-[#d1d5db] h-[16px] relative rounded-[2px] shrink-0 w-[262.94px]" data-name="Background" />
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-start p-[25px] relative rounded-[4px] shrink-0 w-[378.67px]" data-name="Card 2">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Margin2 />
      <Heading4 />
      <Container8 />
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex items-center justify-center p-px relative rounded-[12px] shrink-0 size-[48px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[13px] text-center whitespace-nowrap">
        <p className="leading-[19.5px]">Icon</p>
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div className="h-[60px] relative shrink-0 w-[48px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] relative size-full">
        <BackgroundBorder3 />
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[24px] w-full">
          <p className="leading-[32px]">Veterinary Care</p>
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <div className="bg-[#d1d5db] h-[16px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
        <div className="bg-[#d1d5db] h-[16px] relative rounded-[2px] shrink-0 w-[246.48px]" data-name="Background" />
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-start p-[25px] relative rounded-[4px] shrink-0 w-[378.66px]" data-name="Card 3">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Margin3 />
      <Heading5 />
      <Container9 />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex gap-[24px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Card />
      <Card1 />
      <Card2 />
    </div>
  );
}

function SectionServiceGrid() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full" data-name="Section - Service Grid">
      <Heading2 />
      <Container6 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[30px] text-center tracking-[-0.3px] whitespace-nowrap">
        <p className="leading-[38px]">How It Works</p>
      </div>
    </div>
  );
}

function BackgroundBorder4() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex items-center justify-center p-px relative rounded-[12px] shrink-0 size-[64px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[18px] text-center whitespace-nowrap">
        <p className="leading-[28px]">1</p>
      </div>
    </div>
  );
}

function Margin4() {
  return (
    <div className="h-[76px] relative shrink-0 w-[64px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] relative size-full">
        <BackgroundBorder4 />
      </div>
    </div>
  );
}

function Step() {
  return (
    <div className="bg-[#faf8ff] content-stretch flex flex-col gap-[12px] items-center p-[25px] relative rounded-[12px] shrink-0 w-[192px]" data-name="Step 1">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Margin4 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Register</p>
      </div>
    </div>
  );
}

function BackgroundBorder5() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex items-center justify-center p-px relative rounded-[12px] shrink-0 size-[64px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[18px] text-center whitespace-nowrap">
        <p className="leading-[28px]">2</p>
      </div>
    </div>
  );
}

function Margin5() {
  return (
    <div className="h-[76px] relative shrink-0 w-[64px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] relative size-full">
        <BackgroundBorder5 />
      </div>
    </div>
  );
}

function Step1() {
  return (
    <div className="bg-[#faf8ff] content-stretch flex flex-col gap-[12px] items-center p-[25px] relative rounded-[12px] shrink-0 w-[192px]" data-name="Step 2">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Margin5 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Match</p>
      </div>
    </div>
  );
}

function BackgroundBorder6() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex items-center justify-center p-px relative rounded-[12px] shrink-0 size-[64px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[18px] text-center whitespace-nowrap">
        <p className="leading-[28px]">3</p>
      </div>
    </div>
  );
}

function Margin6() {
  return (
    <div className="h-[76px] relative shrink-0 w-[64px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] relative size-full">
        <BackgroundBorder6 />
      </div>
    </div>
  );
}

function Step2() {
  return (
    <div className="bg-[#faf8ff] content-stretch flex flex-col gap-[12px] items-center p-[25px] relative rounded-[12px] shrink-0 w-[192px]" data-name="Step 3">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Margin6 />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Connect</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <div className="-translate-y-1/2 absolute bg-[#c5c5d3] h-px left-0 right-0 top-[calc(50%+0.5px)]" data-name="Connecting Line Placeholder (Hidden on mobile)" />
      <Step />
      <Step1 />
      <Step2 />
    </div>
  );
}

function SectionHowItWorksProcess() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start py-[64px] relative shrink-0 w-full" data-name="Section - How it Works Process">
      <Heading6 />
      <Container10 />
    </div>
  );
}

function Heading7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[30px] tracking-[-0.3px] whitespace-nowrap">
        <p className="leading-[38px]">Urgent Placements</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#00236f] text-[14px] tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">View All</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex items-end justify-between relative shrink-0 w-full" data-name="Container">
      <Heading7 />
      <Link />
    </div>
  );
}

function BackgroundBorder7() {
  return (
    <div className="bg-[#e5e7eb] h-[192px] relative shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[13px] text-center whitespace-nowrap">
          <p className="leading-[19.5px]">Image</p>
        </div>
      </div>
    </div>
  );
}

function Heading8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[24px] w-full">
        <p className="leading-[32px]">ID: A-492</p>
      </div>
    </div>
  );
}

function BackgroundBorder8() {
  return (
    <div className="bg-[#e5e7eb] relative rounded-[2px] self-stretch shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[9px] py-[5px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center whitespace-nowrap">
            <p className="leading-[16px]">Tag 1</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder9() {
  return (
    <div className="bg-[#e5e7eb] relative rounded-[2px] self-stretch shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[9px] py-[5px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center whitespace-nowrap">
            <p className="leading-[16px]">Tag 2</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex gap-[4px] h-[26px] items-start relative shrink-0 w-full" data-name="Container">
      <BackgroundBorder8 />
      <BackgroundBorder9 />
    </div>
  );
}

function Container13() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start p-[24px] relative size-full">
        <Heading8 />
        <Container14 />
      </div>
    </div>
  );
}

function AnimalCard() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Animal Card 1">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <BackgroundBorder7 />
        <Container13 />
      </div>
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function BackgroundBorder10() {
  return (
    <div className="bg-[#e5e7eb] h-[192px] relative shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[13px] text-center whitespace-nowrap">
          <p className="leading-[19.5px]">Image</p>
        </div>
      </div>
    </div>
  );
}

function Heading9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[24px] w-full">
        <p className="leading-[32px]">ID: C-118</p>
      </div>
    </div>
  );
}

function BackgroundBorder11() {
  return (
    <div className="bg-[#e5e7eb] relative rounded-[2px] self-stretch shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[9px] py-[5px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center whitespace-nowrap">
            <p className="leading-[16px]">Tag 1</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex h-[26px] items-start relative shrink-0 w-full" data-name="Container">
      <BackgroundBorder11 />
    </div>
  );
}

function Container15() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start p-[24px] relative size-full">
        <Heading9 />
        <Container16 />
      </div>
    </div>
  );
}

function AnimalCard1() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Animal Card 2">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <BackgroundBorder10 />
        <Container15 />
      </div>
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function BackgroundBorder12() {
  return (
    <div className="bg-[#e5e7eb] h-[192px] relative shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[13px] text-center whitespace-nowrap">
          <p className="leading-[19.5px]">Image</p>
        </div>
      </div>
    </div>
  );
}

function Heading10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[24px] w-full">
        <p className="leading-[32px]">ID: D-704</p>
      </div>
    </div>
  );
}

function BackgroundBorder13() {
  return (
    <div className="bg-[#e5e7eb] relative rounded-[2px] self-stretch shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[9px] py-[5px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center whitespace-nowrap">
            <p className="leading-[16px]">Tag 1</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder14() {
  return (
    <div className="bg-[#e5e7eb] relative rounded-[2px] self-stretch shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[9px] py-[5px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center whitespace-nowrap">
            <p className="leading-[16px]">Tag 2</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex gap-[4px] h-[26px] items-start relative shrink-0 w-full" data-name="Container">
      <BackgroundBorder13 />
      <BackgroundBorder14 />
    </div>
  );
}

function Container17() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start p-[24px] relative size-full">
        <Heading10 />
        <Container18 />
      </div>
    </div>
  );
}

function AnimalCard2() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Animal Card 3">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <BackgroundBorder12 />
        <Container17 />
      </div>
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function BackgroundBorder15() {
  return (
    <div className="bg-[#e5e7eb] h-[192px] relative shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[13px] text-center whitespace-nowrap">
          <p className="leading-[19.5px]">Image</p>
        </div>
      </div>
    </div>
  );
}

function Heading11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[24px] w-full">
        <p className="leading-[32px]">ID: R-092</p>
      </div>
    </div>
  );
}

function BackgroundBorder16() {
  return (
    <div className="bg-[#e5e7eb] relative rounded-[2px] self-stretch shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[9px] py-[5px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center whitespace-nowrap">
            <p className="leading-[16px]">Tag 1</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex h-[26px] items-start relative shrink-0 w-full" data-name="Container">
      <BackgroundBorder16 />
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start p-[24px] relative size-full">
        <Heading11 />
        <Container20 />
      </div>
    </div>
  );
}

function AnimalCard3() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[4px]" data-name="Animal Card 4">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <BackgroundBorder15 />
        <Container19 />
      </div>
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex gap-[24px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <AnimalCard />
      <AnimalCard1 />
      <AnimalCard2 />
      <AnimalCard3 />
    </div>
  );
}

function SectionFeaturedAnimalGrid() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full" data-name="Section - Featured Animal Grid">
      <Container11 />
      <Container12 />
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#00236f] content-stretch flex flex-col items-center justify-center px-[40px] py-[12px] relative rounded-[2px] shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Apply Now</p>
      </div>
    </div>
  );
}

function ButtonMargin() {
  return (
    <div className="relative shrink-0" data-name="Button:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <Button3 />
      </div>
    </div>
  );
}

function Volunteer() {
  return (
    <div className="bg-[#e9e7ef] flex-[1_0_0] min-w-px relative rounded-[8px]" data-name="Volunteer">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[104px] items-start p-[65px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[30px] tracking-[-0.3px] whitespace-nowrap">
          <p className="leading-[38px]">Become a Volunteer</p>
        </div>
        <ButtonMargin />
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#90a8ff] content-stretch flex flex-col items-center justify-center px-[40px] py-[12px] relative rounded-[2px] shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1e3a8a] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Donate Today</p>
      </div>
    </div>
  );
}

function ButtonMargin1() {
  return (
    <div className="relative shrink-0" data-name="Button:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <Button4 />
      </div>
    </div>
  );
}

function Donation() {
  return (
    <div className="bg-[#1e3a8a] flex-[1_0_0] min-w-px relative rounded-[8px]" data-name="Donation">
      <div aria-hidden className="absolute border border-[#1e3a8a] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[104px] items-start p-[65px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#90a8ff] text-[30px] tracking-[-0.3px] whitespace-nowrap">
          <p className="leading-[38px]">Support Our Cause</p>
        </div>
        <ButtonMargin1 />
      </div>
    </div>
  );
}

function SectionVolunteerDonationCtAsSplitLayout() {
  return (
    <div className="content-stretch flex gap-[40px] items-start justify-center py-[64px] relative shrink-0 w-full" data-name="Section - Volunteer & Donation CTAs (Split Layout)">
      <Volunteer />
      <Donation />
    </div>
  );
}

function BackgroundBorder17() {
  return (
    <div className="bg-[#e5e7eb] relative self-stretch shrink-0 w-[394px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[13px] text-center whitespace-nowrap">
          <p className="leading-[19.5px]">Story Image</p>
        </div>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[12px] tracking-[0.6px] uppercase w-full">
        <p className="leading-[16px]">IMPACT REPORT</p>
      </div>
    </div>
  );
}

function Heading12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[30px] tracking-[-0.3px] w-full">
        <p className="leading-[38px]">From Rescue to Rehabilitation</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <div className="bg-[#d1d5db] h-[20px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
      <div className="bg-[#d1d5db] h-[20px] relative rounded-[2px] shrink-0 w-[605px]" data-name="Background" />
      <div className="bg-[#d1d5db] h-[20px] relative rounded-[2px] shrink-0 w-[528px]" data-name="Background" />
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#00236f] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">Read Full Story</p>
      </div>
    </div>
  );
}

function LinkMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[12px] relative shrink-0 w-full" data-name="Link:margin">
      <Link1 />
    </div>
  );
}

function Container21() {
  return (
    <div className="relative self-stretch shrink-0 w-[788px]" data-name="Container">
      <div className="flex flex-col justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start justify-center p-[64px] relative size-full">
          <Container22 />
          <Heading12 />
          <Container23 />
          <LinkMargin />
        </div>
      </div>
    </div>
  );
}

function SectionSuccessStoryTeaser() {
  return (
    <div className="bg-white h-[364px] relative rounded-[8px] shrink-0 w-full" data-name="Section - Success Story Teaser">
      <div className="content-stretch flex items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <BackgroundBorder17 />
        <Container21 />
      </div>
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Heading13() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[30px] text-center tracking-[-0.3px] whitespace-nowrap">
        <p className="leading-[38px]">Frequently Asked Questions</p>
      </div>
    </div>
  );
}

function Heading2Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Heading 2:margin">
      <Heading13 />
    </div>
  );
}

function BackgroundBorder18() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex items-center justify-center p-px relative rounded-[2px] shrink-0 size-[24px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">+</p>
      </div>
    </div>
  );
}

function Heading14() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] whitespace-nowrap">
          <p className="leading-[20px]">Question Placeholder 1</p>
        </div>
        <BackgroundBorder18 />
      </div>
    </div>
  );
}

function FaqItem() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[25px] pt-[24px] relative shrink-0 w-full" data-name="FAQ Item 1">
      <div aria-hidden className="absolute border-[#c5c5d3] border-b border-solid inset-0 pointer-events-none" />
      <Heading14 />
    </div>
  );
}

function BackgroundBorder19() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex items-center justify-center p-px relative rounded-[2px] shrink-0 size-[24px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">+</p>
      </div>
    </div>
  );
}

function Heading15() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] whitespace-nowrap">
          <p className="leading-[20px]">Question Placeholder 2</p>
        </div>
        <BackgroundBorder19 />
      </div>
    </div>
  );
}

function FaqItem1() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[25px] pt-[24px] relative shrink-0 w-full" data-name="FAQ Item 2">
      <div aria-hidden className="absolute border-[#c5c5d3] border-b border-solid inset-0 pointer-events-none" />
      <Heading15 />
    </div>
  );
}

function BackgroundBorder20() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex items-center justify-center p-px relative rounded-[2px] shrink-0 size-[24px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">+</p>
      </div>
    </div>
  );
}

function Heading16() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] whitespace-nowrap">
          <p className="leading-[20px]">Question Placeholder 3</p>
        </div>
        <BackgroundBorder20 />
      </div>
    </div>
  );
}

function FaqItem2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[25px] pt-[24px] relative shrink-0 w-full" data-name="FAQ Item 3">
      <div aria-hidden className="absolute border-[#c5c5d3] border-b border-solid inset-0 pointer-events-none" />
      <Heading16 />
    </div>
  );
}

function SectionFaqList() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start max-w-[896px] py-[64px] relative shrink-0 w-full" data-name="Section - FAQ List">
      <Heading2Margin />
      <FaqItem />
      <FaqItem1 />
      <FaqItem2 />
    </div>
  );
}

function SectionFaqListMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Section - FAQ List:margin">
      <div className="content-stretch flex flex-col items-start px-[144px] relative size-full">
        <SectionFaqList />
      </div>
    </div>
  );
}

function Main() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[64px] items-start left-0 max-w-[1280px] px-[48px] py-[64px] right-0 top-[61px]" data-name="Main">
      <HeroSection />
      <SectionEmergencyRescueCta />
      <SectionMissionStatementMargin />
      <SectionServiceGrid />
      <SectionHowItWorksProcess />
      <SectionFeaturedAnimalGrid />
      <SectionVolunteerDonationCtAsSplitLayout />
      <SectionSuccessStoryTeaser />
      <SectionFaqListMargin />
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[24px] w-full">
        <p className="leading-[32px]">RescueLink</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] w-full">
        <p className="leading-[20px] mb-0">© 2024 Animal Welfare Public Service</p>
        <p className="leading-[20px]">Platform. All rights reserved.</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px relative" data-name="Container">
      <Container26 />
      <Container27 />
    </div>
  );
}

function Heading17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">Legal</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] w-full">
        <p className="leading-[20px]">Privacy Policy</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] w-full">
        <p className="leading-[20px]">Terms of Service</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px pb-[12px] relative" data-name="Container">
      <Heading17 />
      <Link2 />
      <Link3 />
    </div>
  );
}

function Heading18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">Community</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] w-full">
        <p className="leading-[20px]">Accessibility Statement</p>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] w-full">
        <p className="leading-[20px]">Community Guidelines</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px pb-[12px] relative" data-name="Container">
      <Heading18 />
      <Link4 />
      <Link5 />
    </div>
  );
}

function Heading19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">Support</p>
      </div>
    </div>
  );
}

function Link6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] w-full">
        <p className="leading-[20px]">Contact Us</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px pb-[44px] relative" data-name="Container">
      <Heading19 />
      <Link6 />
    </div>
  );
}

function Container24() {
  return (
    <div className="max-w-[1280px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row justify-center max-w-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-start justify-center max-w-[inherit] px-[48px] py-[64px] relative size-full">
          <Container25 />
          <Container28 />
          <Container29 />
          <Container30 />
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-[#eeedf4] content-stretch flex flex-col items-start pt-px relative shrink-0 w-full" data-name="Footer">
      <div aria-hidden className="absolute border-[#c5c5d3] border-solid border-t inset-0 pointer-events-none" />
      <Container24 />
    </div>
  );
}

function FooterMargin() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[64px] right-0 top-[4070px]" data-name="Footer:margin">
      <Footer />
    </div>
  );
}

function BrandLogoPlaceholder() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Brand Logo Placeholder">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#00236f] text-[24px] whitespace-nowrap">
        <p className="leading-[32px]">RescueLink</p>
      </div>
    </div>
  );
}

function SearchBarPlaceholder() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex h-[40px] items-center justify-center p-px relative rounded-[6px] shrink-0 w-[256px]" data-name="Search Bar Placeholder">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="[word-break:break-word] flex flex-col font-['Nimbus_Mono_PS:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[13px] text-center whitespace-nowrap">
        <p className="leading-[19.5px]">Search...</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex gap-[64px] items-center relative shrink-0" data-name="Container">
      <BrandLogoPlaceholder />
      <SearchBarPlaceholder />
    </div>
  );
}

function Link7() {
  return (
    <div className="relative self-stretch shrink-0" data-name="Link">
      <div aria-hidden className="absolute border-[#00236f] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pb-[6px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#00236f] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Find Pets</p>
        </div>
      </div>
    </div>
  );
}

function Link8() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Services</p>
      </div>
    </div>
  );
}

function Link9() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Volunteer</p>
      </div>
    </div>
  );
}

function Link10() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Donate</p>
      </div>
    </div>
  );
}

function NavigationLinks() {
  return (
    <div className="content-stretch flex gap-[24px] h-[30px] items-start relative shrink-0" data-name="Navigation Links">
      <Link7 />
      <Link8 />
      <Link9 />
      <Link10 />
    </div>
  );
}

function ButtonTrailingPrimaryAction() {
  return (
    <div className="bg-[#00236f] content-stretch flex flex-col items-center justify-center px-[24px] py-[12px] relative rounded-[2px] shrink-0" data-name="Button - Trailing Primary Action">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Report Emergency</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Container">
      <ButtonTrailingPrimaryAction />
      <div className="bg-[#e5e7eb] relative rounded-[12px] shrink-0 size-[32px]" data-name="Trailing Icon Actions Placeholders (Icons hidden via CSS, showing boxes)">
        <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[12px]" />
      </div>
      <div className="bg-[#e5e7eb] relative rounded-[12px] shrink-0 size-[32px]" data-name="Background+Border">
        <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[12px]" />
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[48px] py-[8px] relative size-full">
          <Container32 />
          <NavigationLinks />
          <Container33 />
        </div>
      </div>
    </div>
  );
}

function HeaderTopAppBar() {
  return (
    <div className="absolute bg-[#faf8ff] content-stretch flex flex-col items-start left-0 pb-px right-0 top-0" data-name="Header - TopAppBar">
      <div aria-hidden className="absolute border-[#c5c5d3] border-b border-solid inset-0 pointer-events-none" />
      <Container31 />
    </div>
  );
}

export default function HomepageWireframeDesktop() {
  return (
    <div className="relative size-full" data-name="Homepage Wireframe (Desktop)">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(90deg, rgb(250, 248, 255) 0%, rgb(250, 248, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} />
        <div className="absolute bg-white inset-0 mix-blend-saturation" />
      </div>
      <Main />
      <FooterMargin />
      <HeaderTopAppBar />
    </div>
  );
}