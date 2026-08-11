import svgPaths from "./svg-xtlzjm992u";

function Heading() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[32px] tracking-[-0.64px] w-full">
          <p className="leading-[40px]">Stay Calm.</p>
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[18px] w-full">
          <p className="leading-[28px] mb-0">We are here to help. Fill out the</p>
          <p className="leading-[28px] mb-0">information below so we can dispatch</p>
          <p className="leading-[28px]">appropriate assistance immediately.</p>
        </div>
      </div>
    </div>
  );
}

function SectionCrisisReassurance() {
  return (
    <div className="relative shrink-0 w-full" data-name="Section - Crisis Reassurance">
      <div aria-hidden className="absolute border-[#1a1b21] border-l-4 border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[12px] items-start pl-[28px] py-[4px] relative size-full">
        <Heading />
        <Container />
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] uppercase w-full">
        <p className="leading-[20px]">SITUATION TYPE</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#1a1b21] content-stretch flex flex-[1_0_0] flex-col items-center justify-center min-w-px pb-[42.5px] pt-[41.5px] px-[2px] relative" data-name="Button">
      <div aria-hidden className="absolute border-2 border-[#1a1b21] border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#faf8ff] text-[24px] text-center whitespace-nowrap">
        <p className="leading-[32px]">CRITICAL</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-center justify-center min-w-px px-[2px] py-[26px] relative" data-name="Button">
      <div aria-hidden className="absolute border-2 border-[#c5c5d3] border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[24px] text-center whitespace-nowrap">
        <p className="leading-[32px] mb-0">NON-</p>
        <p className="leading-[32px]">CRITICAL</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[8px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function SectionEmergencyToggle() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Section - Emergency Toggle">
      <Label />
      <Container1 />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">Location</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[18px] w-full">
          <p className="leading-[normal]">Current address or coordinates</p>
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Input">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pb-[30px] pt-[29px] px-[14px] relative size-full">
          <Container3 />
        </div>
      </div>
      <div aria-hidden className="absolute border-2 border-[#c5c5d3] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Container">
      <Label1 />
      <Input />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">Animal Description</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[18px] w-full">
          <p className="leading-[28px]">Species, size, condition</p>
        </div>
      </div>
    </div>
  );
}

function Textarea() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Textarea">
      <div className="overflow-auto rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pb-[82px] pt-[26px] px-[14px] relative size-full">
          <Container5 />
        </div>
      </div>
      <div aria-hidden className="absolute border-2 border-[#c5c5d3] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Container">
      <Label2 />
      <Textarea />
    </div>
  );
}

function SectionMobileOptimizedForm() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full" data-name="Section - Mobile Optimized Form">
      <Container2 />
      <Container4 />
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">Visual Evidence (Optional)</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[24px] text-center whitespace-nowrap">
          <p className="leading-[32px]">TAP TO CAMERA</p>
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[12px] text-center whitespace-nowrap">
          <p className="leading-[16px]">Attach photo for context</p>
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#f4f3fa] content-stretch flex flex-col gap-[12px] h-[192px] items-center justify-center p-[4px] relative rounded-[4px] shrink-0 w-full" data-name="Button">
      <div aria-hidden className="absolute border-4 border-[#c5c5d3] border-dashed inset-0 pointer-events-none rounded-[4px]" />
      <Container6 />
      <Container7 />
    </div>
  );
}

function SectionCameraUpload() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Section - Camera Upload">
      <Label3 />
      <Button2 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[24px] w-full">
          <p className="leading-[32px]">What happens next?</p>
        </div>
      </div>
    </div>
  );
}

function Item() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Item">
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-0 top-[12px]">
        <p className="leading-[24px]">{` `}</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-0 top-[24px]">
        <p className="leading-[24px] mb-0">Your report goes directly to the</p>
        <p className="leading-[24px]">nearest available unit.</p>
      </div>
    </div>
  );
}

function Item1() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Item">
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-0 top-[12px]">
        <p className="leading-[24px]">{` `}</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-0 top-[24px]">
        <p className="leading-[24px] mb-0">An operator may call you for further</p>
        <p className="leading-[24px]">details.</p>
      </div>
    </div>
  );
}

function Item2() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Item">
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-0 top-[12px]">
        <p className="leading-[24px]">{` `}</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-0 top-[24px]">
        <p className="leading-[24px] mb-0">Do not intervene if the situation is</p>
        <p className="leading-[24px]">dangerous.</p>
      </div>
    </div>
  );
}

function List() {
  return (
    <div className="relative shrink-0 w-full" data-name="List">
      <div className="[word-break:break-word] bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col font-['Inter:Regular',sans-serif] font-normal gap-[8px] items-start leading-[0] not-italic pl-[24px] relative size-full text-[#444651] text-[16px] whitespace-nowrap">
        <Item />
        <Item1 />
        <Item2 />
      </div>
    </div>
  );
}

function SectionProcessExplanation() {
  return (
    <div className="bg-[#eeedf4] relative rounded-[4px] shrink-0 w-full" data-name="Section - Process Explanation">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[25px] relative size-full">
        <Heading1 />
        <List />
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#1a1b21] content-stretch flex items-center justify-center py-[24px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[8px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" data-name="Button:shadow" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#faf8ff] text-[30px] text-center tracking-[1.5px] uppercase whitespace-nowrap">
        <p className="leading-[38px]">SUBMIT REPORT</p>
      </div>
    </div>
  );
}

function SectionSubmitButton() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[64px] pt-[24px] relative shrink-0 w-full" data-name="Section - Submit Button">
      <Button3 />
    </div>
  );
}

function MainContentCanvas() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[64px] items-start left-0 max-w-[448px] px-[16px] py-[40px] right-0 top-[57px]" data-name="Main Content Canvas">
      <SectionCrisisReassurance />
      <SectionEmergencyToggle />
      <SectionMobileOptimizedForm />
      <SectionCameraUpload />
      <SectionProcessExplanation />
      <SectionSubmitButton />
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col items-center relative self-stretch shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Privacy</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex flex-col items-center relative self-stretch shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Terms</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex flex-col items-center relative self-stretch shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Support</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex gap-[24px] h-[20px] items-start relative shrink-0" data-name="Container">
      <Link />
      <Link1 />
      <Link2 />
    </div>
  );
}

function Margin() {
  return (
    <div className="relative shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <Container8 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">© 2024 PawGuard Enterprise</p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="relative shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <Container9 />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="absolute bg-[#f4f3fa] bottom-0 content-stretch flex flex-col items-center left-0 pb-[40px] pt-[41px] px-[16px] right-0" data-name="Footer">
      <div aria-hidden className="absolute border-[#c5c5d3] border-solid border-t inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#00236f] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">PawGuard</p>
      </div>
      <Margin />
      <Margin1 />
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[19px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="19" preserveAspectRatio="none" viewBox="0 0 20 19" width="20">
        <g id="Container">
          <path d={svgPaths.p21331c20} fill="var(--fill-0, #00236F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#00236f] text-[24px] whitespace-nowrap">
        <p className="leading-[32px]">PawGuard</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <Container12 />
      <Container13 />
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[13px] py-[5px] relative shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#00236f] border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#00236f] text-[14px] text-center tracking-[1.4px] uppercase whitespace-nowrap">
        <p className="leading-[20px]">EMERGENCY</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pl-[16px] pr-[15.99px] py-[12px] relative size-full">
          <Container11 />
          <Button4 />
        </div>
      </div>
    </div>
  );
}

function HeaderTopAppBar() {
  return (
    <div className="absolute bg-[#faf8ff] content-stretch flex flex-col items-start left-0 pb-px right-0 top-0" data-name="Header - TopAppBar">
      <div aria-hidden className="absolute border-[#c5c5d3] border-b border-solid inset-0 pointer-events-none" />
      <Container10 />
    </div>
  );
}

export default function EmergencyReportWireframeMobile() {
  return (
    <div className="relative size-full" data-name="Emergency Report Wireframe (Mobile)">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(90deg, rgb(250, 248, 255) 0%, rgb(250, 248, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} />
        <div className="absolute bg-white inset-0 mix-blend-saturation" />
      </div>
      <MainContentCanvas />
      <Footer />
      <HeaderTopAppBar />
    </div>
  );
}