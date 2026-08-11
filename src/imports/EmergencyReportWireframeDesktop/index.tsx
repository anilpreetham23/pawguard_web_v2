function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[40px] tracking-[-0.8px] w-full">
        <p className="leading-[48px]">Report an Animal in Distress</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[768px] relative shrink-0 w-[768px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[18px] whitespace-nowrap">
        <p className="leading-[28px] mb-0">Stay calm. Your report helps us dispatch the right team quickly. Please provide as much</p>
        <p className="leading-[28px]">accurate information as possible.</p>
      </div>
    </div>
  );
}

function HeaderReassurance() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Header & Reassurance">
      <Heading />
      <Container />
    </div>
  );
}

function HeaderReassuranceMargin() {
  return (
    <div className="col-[1/span_12] content-stretch flex flex-col items-start justify-self-stretch pb-[40px] relative row-1 self-start shrink-0" data-name="Header & Reassurance:margin">
      <HeaderReassurance />
    </div>
  );
}

function Heading1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[24px] w-full">
          <p className="leading-[32px]">Is this an immediate life-threatening emergency?</p>
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
          <p className="leading-[20px] mb-0">Severe injury, active abuse, struck by</p>
          <p className="leading-[20px]">vehicle.</p>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#faf8ff] content-stretch flex flex-col gap-[4.5px] items-center p-[26px] relative rounded-[4px] shrink-0 w-[360.66px]" data-name="Button">
      <div aria-hidden className="absolute border-2 border-[#1a1b21] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">YES - Life Threatening</p>
      </div>
      <Container2 />
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
          <p className="leading-[20px]">Stray sighting, general welfare check.</p>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#f4f3fa] content-stretch flex flex-col gap-[4.5px] items-center pb-[36px] pt-[35.5px] px-[25px] relative rounded-[4px] shrink-0 w-[358.67px]" data-name="Button">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">NO - Non-Urgent</p>
      </div>
      <Container3 />
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-start justify-center relative size-full">
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

function SectionFilterEmergencyVsNonEmergency() {
  return (
    <div className="bg-[#faf8ff] relative rounded-[4px] shrink-0 w-full" data-name="Section - Filter: Emergency vs Non-Emergency">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[25px] relative size-full">
        <Heading1 />
        <Container1 />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[24px] w-full">
          <p className="leading-[32px]">Incident Details</p>
        </div>
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">Location of Animal</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] w-full">
          <p className="leading-[normal]">Enter street address or intersection...</p>
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#faf8ff] flex-[1_0_0] min-w-px relative rounded-[2px] self-stretch" data-name="Input">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start px-[13px] py-[15px] relative size-full">
          <Container5 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#eeedf4] content-stretch flex flex-col items-center justify-center pb-[15.5px] pt-[14.5px] px-[13px] relative rounded-[2px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Use My Location</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Container">
      <Input />
      <Button2 />
    </div>
  );
}

function Location() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Location">
      <Label />
      <Container4 />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">Photo (Optional but helpful)</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Drag and drop image here</p>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="relative shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[4px] relative size-full">
        <Container6 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] text-center whitespace-nowrap">
          <p className="leading-[20px]">or</p>
        </div>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#faf8ff] content-stretch flex flex-col items-center justify-center px-[13px] py-[5px] relative rounded-[2px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Browse Files</p>
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

function BackgroundBorder() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden className="absolute border-2 border-[#c5c5d3] border-dashed inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center p-[66px] relative size-full">
          <Margin />
          <Container7 />
          <ButtonMargin />
        </div>
      </div>
    </div>
  );
}

function Photo() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Photo">
      <Label1 />
      <BackgroundBorder />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">Description of Animal and Situation</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] w-full">
          <p className="leading-[24px]">Breed, color, condition, specific injuries...</p>
        </div>
      </div>
    </div>
  );
}

function Textarea() {
  return (
    <div className="bg-[#faf8ff] relative rounded-[2px] shrink-0 w-full" data-name="Textarea">
      <div className="flex flex-row justify-center overflow-auto rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[85px] pt-[13px] px-[13px] relative size-full">
          <Container8 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Description() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start pb-[6px] relative shrink-0 w-full" data-name="Description">
      <Label2 />
      <Textarea />
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">Your Name (Optional)</p>
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-[#faf8ff] h-[50px] relative rounded-[2px] shrink-0 w-full" data-name="Input">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[359.66px]" data-name="Container">
      <Label3 />
      <Input1 />
    </div>
  );
}

function Label4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">Phone Number</p>
      </div>
    </div>
  );
}

function Input2() {
  return (
    <div className="bg-[#faf8ff] h-[50px] relative rounded-[2px] shrink-0 w-full" data-name="Input">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[359.67px]" data-name="Container">
      <Label4 />
      <Input2 />
    </div>
  );
}

function Contact() {
  return (
    <div className="content-stretch flex gap-[12px] items-start justify-center relative shrink-0 w-full" data-name="Contact">
      <Container9 />
      <Container10 />
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#1a1b21] content-stretch flex flex-col items-center justify-center py-[12px] relative rounded-[2px] shrink-0 w-full" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#faf8ff] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Submit Report</p>
      </div>
    </div>
  );
}

function ButtonMargin1() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[12px] relative shrink-0 w-full" data-name="Button:margin">
      <Button4 />
    </div>
  );
}

function Form() {
  return (
    <div className="relative shrink-0 w-full" data-name="Form">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start relative size-full">
        <Location />
        <Photo />
        <Description />
        <Contact />
        <ButtonMargin1 />
      </div>
    </div>
  );
}

function SectionDataInputForm() {
  return (
    <div className="bg-[#faf8ff] relative rounded-[4px] shrink-0 w-full" data-name="Section - Data Input Form">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[25px] relative size-full">
        <Heading2 />
        <Form />
      </div>
    </div>
  );
}

function MainContentArea() {
  return (
    <div className="col-[1/span_8] content-stretch flex flex-col gap-[40px] items-start justify-self-stretch relative row-2 self-start shrink-0" data-name="Main Content Area">
      <SectionFilterEmergencyVsNonEmergency />
      <SectionDataInputForm />
    </div>
  );
}

function Heading3() {
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

function BackgroundBorder1() {
  return (
    <div className="bg-[#faf8ff] content-stretch flex items-center justify-center pb-[4.5px] pt-[3.5px] px-px relative rounded-[12px] shrink-0 size-[24px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#757682] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">1</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Report Reviewed</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] whitespace-nowrap">
        <p className="leading-[20px] mb-0">Our dispatch team evaluates the details</p>
        <p className="leading-[20px]">immediately.</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0 w-[260.97px]" data-name="Container">
      <Container12 />
      <Container13 />
    </div>
  );
}

function Item() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Item">
      <BackgroundBorder1 />
      <Container11 />
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-[#faf8ff] content-stretch flex items-center justify-center pb-[4.5px] pt-[3.5px] px-px relative rounded-[12px] shrink-0 size-[24px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#757682] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">2</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Team Dispatched</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] whitespace-nowrap">
        <p className="leading-[20px] mb-0">The nearest available response unit is sent</p>
        <p className="leading-[20px]">to the location.</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0 w-[281.87px]" data-name="Container">
      <Container15 />
      <Container16 />
    </div>
  );
}

function Item1() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Item">
      <BackgroundBorder2 />
      <Container14 />
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="bg-[#faf8ff] content-stretch flex items-center justify-center pb-[4.5px] pt-[3.5px] px-px relative rounded-[12px] shrink-0 size-[24px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#757682] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">3</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Status Update</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] whitespace-nowrap">
        <p className="leading-[20px] mb-0">If you provided contact info, we may reach</p>
        <p className="leading-[20px]">out for clarification or updates.</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0 w-[282.31px]" data-name="Container">
      <Container18 />
      <Container19 />
    </div>
  );
}

function Item2() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Item">
      <BackgroundBorder3 />
      <Container17 />
    </div>
  );
}

function OrderedList() {
  return (
    <div className="relative shrink-0 w-full" data-name="Ordered List">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative size-full">
        <Item />
        <Item1 />
        <Item2 />
      </div>
    </div>
  );
}

function Section() {
  return (
    <div className="bg-[#f4f3fa] relative rounded-[4px] shrink-0 w-full" data-name="Section">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[25px] relative size-full">
        <Heading3 />
        <OrderedList />
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[24px] w-full">
          <p className="leading-[32px]">Response Timeline</p>
        </div>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Life-Threatening</p>
        </div>
      </div>
    </div>
  );
}

function Border() {
  return (
    <div className="relative rounded-[2px] shrink-0" data-name="Border">
      <div aria-hidden className="absolute border border-[#757682] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[9px] py-px relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">~15 mins</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[#c5c5d3] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-[5px] relative size-full">
          <Container21 />
          <Border />
        </div>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Urgent Medical</p>
        </div>
      </div>
    </div>
  );
}

function Border1() {
  return (
    <div className="relative rounded-[2px] shrink-0" data-name="Border">
      <div aria-hidden className="absolute border border-[#757682] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[9px] py-px relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">1-2 hrs</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="content-stretch flex items-center justify-between pb-[5px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[#c5c5d3] border-b border-solid inset-0 pointer-events-none" />
      <Container22 />
      <Border1 />
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Non-Urgent</p>
      </div>
    </div>
  );
}

function Border2() {
  return (
    <div className="content-stretch flex flex-col items-start px-[9px] py-px relative rounded-[2px] shrink-0" data-name="Border">
      <div aria-hidden className="absolute border border-[#757682] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">24-48 hrs</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pr-[0.01px] relative size-full">
          <Container24 />
          <Border2 />
        </div>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative size-full">
        <HorizontalBorder />
        <HorizontalBorder1 />
        <Container23 />
      </div>
    </div>
  );
}

function Section1() {
  return (
    <div className="bg-[#faf8ff] relative rounded-[4px] shrink-0 w-full" data-name="Section">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[25px] relative size-full">
        <Heading4 />
        <Container20 />
      </div>
    </div>
  );
}

function SidebarProcessInfo() {
  return (
    <div className="col-[9/span_4] content-stretch flex flex-col gap-[40px] items-start justify-self-stretch pb-[528px] relative row-2 self-start shrink-0" data-name="Sidebar / Process Info">
      <Section />
      <Section1 />
    </div>
  );
}

function Main() {
  return (
    <div className="absolute gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(12,minmax(0,1fr))] grid-rows-[__156px_1066px] left-0 px-[48px] py-[64px] right-0 top-[63px]" data-name="Main">
      <HeaderReassuranceMargin />
      <MainContentArea />
      <SidebarProcessInfo />
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[24px] w-full">
        <p className="leading-[32px]">RescueLink</p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="col-[1/span_4] justify-self-stretch relative row-1 self-start shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[24px] relative size-full">
        <Container25 />
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Privacy Policy</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Terms of Service</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Accessibility Statement</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Community Guidelines</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Contact Us</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="col-[1/span_3] h-[20px] justify-self-stretch relative row-2 shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-start relative size-full">
        <Link />
        <Link1 />
        <Link2 />
        <Link3 />
        <Link4 />
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] w-full">
        <p className="leading-[20px]">© 2024 Animal Welfare Public Service Platform. All rights reserved.</p>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="col-[1/span_4] justify-self-stretch relative row-3 self-start shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[24px] relative size-full">
        <Container27 />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-[#eeedf4] relative shrink-0 w-full" data-name="Footer">
      <div aria-hidden className="absolute border-[#c5c5d3] border-solid border-t inset-0 pointer-events-none" />
      <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[___56px_20px_44px] pb-[64px] pt-[65px] px-[48px] relative size-full">
        <Margin1 />
        <Container26 />
        <Margin2 />
      </div>
    </div>
  );
}

function FooterMargin() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[64px] right-0 top-[1437px]" data-name="Footer:margin">
      <Footer />
    </div>
  );
}

function Container28() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[24px] whitespace-nowrap">
          <p className="leading-[32px]">RescueLink</p>
        </div>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Find Pets</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Services</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Volunteer</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Donate</p>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="h-[24px] relative shrink-0" data-name="Nav">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-start relative size-full">
        <Container29 />
        <Container30 />
        <Container31 />
        <Container32 />
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#1a1b21] content-stretch flex flex-col items-center justify-center px-[25px] py-[13px] relative shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#1a1b21] border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#faf8ff] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Report Emergency</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Button5 />
        <div className="bg-[#eeedf4] relative rounded-[12px] shrink-0 size-[32px]" data-name="Background+Border">
          <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[12px]" />
        </div>
        <div className="bg-[#eeedf4] relative rounded-[12px] shrink-0 size-[32px]" data-name="Background+Border">
          <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[12px]" />
        </div>
      </div>
    </div>
  );
}

function HeaderTopAppBarSuppressedForFocusedTransactionalFlowButWireframeRequirementAskedForNavigation() {
  return (
    <div className="absolute bg-[#faf8ff] content-stretch flex items-center justify-between left-0 pb-[9px] pt-[8px] px-[48px] right-0 top-0" data-name="Header - TopAppBar (Suppressed for focused transactional flow, but wireframe requirement asked for Navigation...">
      <div aria-hidden className="absolute border-[#c5c5d3] border-b border-solid inset-0 pointer-events-none" />
      <Container28 />
      <Nav />
      <Container33 />
    </div>
  );
}

export default function EmergencyReportWireframeDesktop() {
  return (
    <div className="relative size-full" data-name="Emergency Report Wireframe (Desktop)">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(90deg, rgb(250, 248, 255) 0%, rgb(250, 248, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} />
        <div className="absolute bg-white inset-0 mix-blend-saturation" />
      </div>
      <Main />
      <FooterMargin />
      <HeaderTopAppBarSuppressedForFocusedTransactionalFlowButWireframeRequirementAskedForNavigation />
    </div>
  );
}