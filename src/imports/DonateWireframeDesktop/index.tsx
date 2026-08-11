function Heading() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[40px] text-center tracking-[-0.8px] whitespace-nowrap">
        <p className="leading-[48px]">Your Support Saves Lives</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[18px] text-center whitespace-nowrap">
        <p className="leading-[28px] mb-0">Every contribution directly funds medical care, shelter, and operational logistics for</p>
        <p className="leading-[28px]">animals in critical need.</p>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start max-w-[768px] pb-[40px] relative shrink-0 w-full" data-name="Hero Section">
      <Heading />
      <Container />
    </div>
  );
}

function HeroSectionMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Hero Section:margin">
      <div className="content-stretch flex flex-col items-start px-[208px] relative size-full">
        <HeroSection />
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 2">
      <div aria-hidden className="absolute border-[#c5c5d3] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[13px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[30px] tracking-[-0.3px] whitespace-nowrap">
          <p className="leading-[38px]">Make a Donation</p>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[rgba(30,58,138,0.1)] content-stretch flex flex-col items-center justify-center px-[2px] py-[14px] relative rounded-[2px] shrink-0 w-[308.33px]" data-name="Button">
      <div aria-hidden className="absolute border-2 border-[#00236f] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#00236f] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">One-Time</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center pb-[14.5px] pt-[13.5px] px-px relative rounded-[2px] shrink-0 w-[306.33px]" data-name="Button">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Monthly</p>
      </div>
    </div>
  );
}

function FrequencyToggle() {
  return (
    <div className="relative shrink-0 w-full" data-name="Frequency Toggle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-start justify-center relative size-full">
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="col-1 content-stretch flex flex-col items-center justify-center justify-self-start pb-[14.5px] pl-[86.84px] pr-[86.86px] pt-[13.5px] relative rounded-[2px] row-1 self-start shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">$25</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[rgba(30,58,138,0.05)] col-2 content-stretch flex flex-col items-center justify-center justify-self-start pl-[86.59px] pr-[86.61px] py-[14px] relative rounded-[2px] row-1 self-start shrink-0" data-name="Button">
      <div aria-hidden className="absolute border-2 border-[#00236f] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#00236f] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">$50</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="col-3 content-stretch flex flex-col items-center justify-center justify-self-start pb-[14.5px] pl-[82.95px] pr-[82.97px] pt-[13.5px] relative rounded-[2px] row-1 self-start shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">$100</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="col-1 content-stretch flex flex-col items-center justify-center justify-self-start pb-[15.5px] pt-[14.5px] px-[81.89px] relative rounded-[2px] row-2 self-start shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">$250</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="col-2 content-stretch flex flex-col items-center justify-center justify-self-start pb-[15.5px] pl-[81.62px] pr-[81.65px] pt-[14.5px] relative rounded-[2px] row-2 self-start shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">$500</p>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="mr-[-0.01px] relative shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-[4px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">$</p>
        </div>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[normal]">Other</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="flex-[1_0_0] min-w-px opacity-50 relative" data-name="Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pb-[2px] pt-px relative rounded-[inherit] size-full">
        <Container1 />
      </div>
    </div>
  );
}

function Border() {
  return (
    <div className="col-3 h-[50px] justify-self-stretch relative rounded-[2px] row-2 shrink-0" data-name="Border">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[13px] relative size-full">
          <Margin />
          <Input />
        </div>
      </div>
    </div>
  );
}

function AmountSelection() {
  return (
    <div className="relative shrink-0 w-full" data-name="Amount Selection">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[__48px_50px] relative size-full">
        <Button2 />
        <Button3 />
        <Button4 />
        <Button5 />
        <Button6 />
        <Border />
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">First Name</p>
      </div>
    </div>
  );
}

function LabelMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[4px] relative shrink-0 w-full" data-name="Label:margin">
      <Label />
    </div>
  );
}

function Input1() {
  return (
    <div className="h-[50px] relative rounded-[2px] shrink-0 w-full" data-name="Input">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <LabelMargin />
      <Input1 />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">Last Name</p>
      </div>
    </div>
  );
}

function LabelMargin1() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[4px] relative shrink-0 w-full" data-name="Label:margin">
      <Label1 />
    </div>
  );
}

function Input2() {
  return (
    <div className="h-[50px] relative rounded-[2px] shrink-0 w-full" data-name="Input">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <LabelMargin1 />
      <Input2 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[12px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container3 />
      <Container4 />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">Email Address</p>
      </div>
    </div>
  );
}

function LabelMargin2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[4px] relative shrink-0 w-full" data-name="Label:margin">
      <Label2 />
    </div>
  );
}

function Input3() {
  return (
    <div className="h-[50px] relative rounded-[2px] shrink-0 w-full" data-name="Input">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <LabelMargin2 />
      <Input3 />
    </div>
  );
}

function DonorDetailsForm() {
  return (
    <div className="relative shrink-0 w-full" data-name="Donor Details Form">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative size-full">
        <Container2 />
        <Container5 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] whitespace-nowrap">
          <p className="leading-[20px]">Payment Details</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex h-[24px] items-center justify-center pb-[5px] pt-[4px] px-px relative rounded-[2px] shrink-0 w-[40px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[10px] text-center whitespace-nowrap">
        <p className="leading-[15px]">Card</p>
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex h-[24px] items-center justify-center pb-[5px] pt-[4px] px-px relative rounded-[2px] shrink-0 w-[40px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[10px] text-center whitespace-nowrap">
        <p className="leading-[15px]">Bank</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start relative size-full">
        <BackgroundBorder1 />
        <BackgroundBorder2 />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[#c5c5d3] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[13px] relative size-full">
        <Container6 />
        <Container7 />
      </div>
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="bg-[#e5e7eb] h-[96px] relative rounded-[2px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden className="absolute border-2 border-[#9ca3af] border-dashed inset-0 pointer-events-none rounded-[2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[2px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] text-center whitespace-nowrap">
          <p className="leading-[24px]">Secure Payment Element Placeholder</p>
        </div>
      </div>
    </div>
  );
}

function PaymentWireframe() {
  return (
    <div className="bg-white relative rounded-[2px] shrink-0 w-full" data-name="Payment Wireframe">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start pb-[25px] pt-[41px] px-[25px] relative size-full">
        <HorizontalBorder />
        <BackgroundBorder3 />
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-[#00236f] relative rounded-[2px] shrink-0 w-full" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center py-[12px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.7px] whitespace-nowrap">
          <p className="leading-[20px]">Complete Donation of $50</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#faf8ff] relative rounded-[8px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[25px] relative size-full">
        <Heading1 />
        <FrequencyToggle />
        <AmountSelection />
        <DonorDetailsForm />
        <PaymentWireframe />
        <Button7 />
      </div>
    </div>
  );
}

function BackgroundBorder4() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex h-[48px] items-center justify-center p-[2px] relative rounded-[12px] shrink-0 w-[52px]" data-name="Background+Border">
      <div aria-hidden className="absolute border-2 border-[#9ca3af] border-dashed inset-0 pointer-events-none rounded-[12px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Badge</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px] mb-0">Verified</p>
        <p className="leading-[16px]">Nonprofit</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-center relative size-full">
        <BackgroundBorder4 />
        <Container9 />
      </div>
    </div>
  );
}

function BackgroundBorder5() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex items-center justify-center p-[2px] relative rounded-[12px] shrink-0 size-[48px]" data-name="Background+Border">
      <div aria-hidden className="absolute border-2 border-[#9ca3af] border-dashed inset-0 pointer-events-none rounded-[12px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Lock</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px] mb-0">Secure</p>
        <p className="leading-[16px]">Transaction</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-center relative size-full">
        <BackgroundBorder5 />
        <Container11 />
      </div>
    </div>
  );
}

function BackgroundBorder6() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex items-center justify-center p-[2px] relative rounded-[12px] shrink-0 size-[48px]" data-name="Background+Border">
      <div aria-hidden className="absolute border-2 border-[#9ca3af] border-dashed inset-0 pointer-events-none rounded-[12px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Star</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px] mb-0">Platinum</p>
        <p className="leading-[16px]">Transparency</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-center relative size-full">
        <BackgroundBorder6 />
        <Container13 />
      </div>
    </div>
  );
}

function TransparencyBadges() {
  return (
    <div className="content-stretch flex gap-[24px] items-center justify-center pb-[24px] pt-[25px] relative shrink-0 w-full" data-name="Transparency Badges">
      <div aria-hidden className="absolute border-[#c5c5d3] border-solid border-t inset-0 pointer-events-none" />
      <Container8 />
      <Container10 />
      <Container12 />
    </div>
  );
}

function LeftColumnGivingForm() {
  return (
    <div className="col-[1/span_7] content-stretch flex flex-col gap-[24px] items-start justify-self-stretch relative row-1 self-start shrink-0" data-name="Left Column: Giving Form">
      <BackgroundBorder />
      <TransparencyBadges />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[24px] w-full">
        <p className="leading-[32px]">The Impact of Your Gift</p>
      </div>
    </div>
  );
}

function Heading3Margin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[24px] relative size-full">
        <Heading2 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="min-w-[80px] relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start min-w-[inherit] pr-[23.69px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#00236f] text-[30px] tracking-[-0.3px] whitespace-nowrap">
          <p className="leading-[38px]">$25</p>
        </div>
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Basic Care Package</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] whitespace-nowrap">
        <p className="leading-[20px] mb-0">Provides essential vaccinations, microchipping,</p>
        <p className="leading-[20px] mb-0">and initial health screening for one rescued</p>
        <p className="leading-[20px]">animal.</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0 w-[313.31px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading3 />
        <Container17 />
      </div>
    </div>
  );
}

function ImpactLevel() {
  return (
    <div className="content-stretch flex gap-[24px] items-start pb-[25px] relative shrink-0 w-full" data-name="Impact Level 1">
      <div aria-hidden className="absolute border-[#c5c5d3] border-b border-solid inset-0 pointer-events-none" />
      <Container15 />
      <Container16 />
    </div>
  );
}

function Container18() {
  return (
    <div className="min-w-[80px] relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start min-w-[inherit] pr-[22.36px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#00236f] text-[30px] tracking-[-0.3px] whitespace-nowrap">
          <p className="leading-[38px]">$50</p>
        </div>
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#00236f] text-[14px] tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">{`Shelter & Nutrition`}</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] whitespace-nowrap">
        <p className="leading-[20px] mb-0">Funds specialized dietary needs and safe, warm</p>
        <p className="leading-[20px] mb-0">boarding for an animal during their first critical</p>
        <p className="leading-[20px]">week of recovery.</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0 w-[318.89px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading4 />
        <Container20 />
      </div>
    </div>
  );
}

function ImpactLevel2HighlightedToMatchSelectedAmount() {
  return (
    <div className="absolute bg-[#faf8ff] content-stretch flex gap-[24px] items-start left-[-12px] pb-[25px] pl-[16px] pr-[12px] pt-[12px] right-[-12px] rounded-[2px] top-0" data-name="Impact Level 2 (Highlighted to match selected amount)">
      <div aria-hidden className="absolute border-[#00236f] border-b border-l-4 border-solid inset-0 pointer-events-none rounded-[2px]" />
      <Container18 />
      <Container19 />
    </div>
  );
}

function ImpactLevel2HighlightedToMatchSelectedAmountMargin() {
  return (
    <div className="h-[121px] relative shrink-0 w-full" data-name="Impact Level 2 (Highlighted to match selected amount):margin">
      <ImpactLevel2HighlightedToMatchSelectedAmount />
    </div>
  );
}

function Container21() {
  return (
    <div className="min-w-[80px] relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start min-w-[inherit] pr-[8.16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#00236f] text-[30px] tracking-[-0.3px] whitespace-nowrap">
          <p className="leading-[38px]">$100</p>
        </div>
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Emergency Medical Fund</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] whitespace-nowrap">
        <p className="leading-[20px] mb-0">Contributes directly to emergency surgeries,</p>
        <p className="leading-[20px] mb-0">diagnostic imaging, and intensive care for</p>
        <p className="leading-[20px]">trauma cases.</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 w-[294.86px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading5 />
        <Container23 />
      </div>
    </div>
  );
}

function ImpactLevel1() {
  return (
    <div className="content-stretch flex gap-[24px] items-start pb-[25px] relative shrink-0 w-full" data-name="Impact Level 3">
      <div aria-hidden className="absolute border-[#c5c5d3] border-b border-solid inset-0 pointer-events-none" />
      <Container21 />
      <Container22 />
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-start min-w-[80px] relative shrink-0 w-[80px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#00236f] text-[30px] tracking-[-0.3px] whitespace-nowrap">
        <p className="leading-[38px]">$250+</p>
      </div>
    </div>
  );
}

function Heading6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[14px] tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Comprehensive Rescue Op</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] whitespace-nowrap">
        <p className="leading-[20px] mb-0">Supports field rescue logistics, transportation</p>
        <p className="leading-[20px] mb-0">across state lines, and full medical rehabilitation</p>
        <p className="leading-[20px]">for severe cases.</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[316.79px]" data-name="Container">
      <Heading6 />
      <Container26 />
    </div>
  );
}

function ImpactLevel2() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full" data-name="Impact Level 4">
      <Container24 />
      <Container25 />
    </div>
  );
}

function Container14() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start pb-[212px] relative size-full">
        <ImpactLevel />
        <ImpactLevel2HighlightedToMatchSelectedAmountMargin />
        <ImpactLevel1 />
        <ImpactLevel2 />
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Italic',sans-serif] font-normal italic justify-center leading-[0] relative shrink-0 text-[#444651] text-[14px] text-center whitespace-nowrap">
          <p className="leading-[20px] mb-0">{`"Because of donors like you, we were able to process`}</p>
          <p className="leading-[20px] mb-0">and rehabilitate over 4,200 animals last year. Thank you</p>
          <p className="leading-[20px]">{`for being a critical part of our infrastructure."`}</p>
        </div>
      </div>
    </div>
  );
}

function AcknowledgementBox() {
  return (
    <div className="bg-[#faf8ff] relative rounded-[2px] shrink-0 w-full" data-name="Acknowledgement Box">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="content-stretch flex flex-col items-start p-[25px] relative size-full">
        <Container27 />
      </div>
    </div>
  );
}

function AcknowledgementBoxMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Acknowledgement Box:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[40px] relative size-full">
        <AcknowledgementBox />
      </div>
    </div>
  );
}

function BackgroundBorder7() {
  return (
    <div className="bg-[#f4f3fa] relative rounded-[8px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#c5c5d3] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start p-[25px] relative size-full">
        <Heading3Margin />
        <Container14 />
        <AcknowledgementBoxMargin />
      </div>
    </div>
  );
}

function RightColumnImpactRoi() {
  return (
    <div className="col-[8/span_5] content-stretch flex flex-col items-start justify-center justify-self-stretch relative row-1 self-start shrink-0" data-name="Right Column: Impact ROI">
      <BackgroundBorder7 />
    </div>
  );
}

function MainContentAreaGivingOptionsAndImpact() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(12,minmax(0,1fr))] grid-rows-[_963px] relative shrink-0 w-full" data-name="Main Content Area: Giving Options and Impact">
      <LeftColumnGivingForm />
      <RightColumnImpactRoi />
    </div>
  );
}

function Main() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[64px] items-start left-0 max-w-[1280px] px-[48px] py-[64px] right-0 top-[53px]" data-name="Main">
      <HeroSectionMargin />
      <MainContentAreaGivingOptionsAndImpact />
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b21] text-[24px] w-full">
        <p className="leading-[32px]">RescueLink</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[12px] w-full">
        <p className="leading-[16px] mb-0">© 2024 Animal Welfare Public Service Platform.</p>
        <p className="leading-[16px]">All rights reserved.</p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[12px] relative shrink-0 w-full" data-name="Margin">
      <Container31 />
    </div>
  );
}

function Container29() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[12px] items-start justify-self-stretch relative row-1 self-start shrink-0" data-name="Container">
      <Container30 />
      <Margin1 />
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Privacy Policy</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Terms of Service</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Accessibility Statement</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Community Guidelines</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Contact Us</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="col-[2/span_3] content-stretch flex gap-[24px] h-[88px] items-start justify-end justify-self-stretch pt-[12px] relative row-1 shrink-0" data-name="Container">
      <Link />
      <Link1 />
      <Link2 />
      <Link3 />
      <Link4 />
    </div>
  );
}

function Container28() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[_88px] px-[48px] py-[64px] relative size-full">
        <Container29 />
        <Container32 />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-[#eeedf4] content-stretch flex flex-col items-start pt-px relative shrink-0 w-full" data-name="Footer">
      <div aria-hidden className="absolute border-[#c5c5d3] border-solid border-t inset-0 pointer-events-none" />
      <Container28 />
    </div>
  );
}

function FooterMargin() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[64px] right-0 top-[1376px]" data-name="Footer:margin">
      <Footer />
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#00236f] text-[24px] whitespace-nowrap">
        <p className="leading-[32px]">RescueLink</p>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Find Pets</p>
      </div>
    </div>
  );
}

function Link6() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Services</p>
      </div>
    </div>
  );
}

function Link7() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#444651] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Volunteer</p>
      </div>
    </div>
  );
}

function Link8() {
  return (
    <div className="relative self-stretch shrink-0" data-name="Link">
      <div aria-hidden className="absolute border-[#00236f] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pb-[6px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#00236f] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Donate</p>
        </div>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex gap-[24px] h-[30px] items-start relative shrink-0" data-name="Container">
      <Link5 />
      <Link6 />
      <Link7 />
      <Link8 />
    </div>
  );
}

function Margin2() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[64px] relative shrink-0" data-name="Margin">
      <Container36 />
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Container">
      <Container35 />
      <Margin2 />
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-[#00236f] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[2px] shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Report Emergency</p>
      </div>
    </div>
  );
}

function WireframePlaceholdersForIcons() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex items-center justify-center pb-[8.5px] pt-[7.5px] px-px relative rounded-[12px] shrink-0 size-[32px]" data-name="Wireframe placeholders for icons">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Ico</p>
      </div>
    </div>
  );
}

function BackgroundBorder8() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex items-center justify-center pb-[8.5px] pt-[7.5px] px-px relative rounded-[12px] shrink-0 size-[32px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Ico</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0" data-name="Container">
      <WireframePlaceholdersForIcons />
      <BackgroundBorder8 />
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Container">
      <Button8 />
      <Container38 />
    </div>
  );
}

function Container33() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[48px] py-[8px] relative size-full">
          <Container34 />
          <Container37 />
        </div>
      </div>
    </div>
  );
}

function HeaderTopAppBar() {
  return (
    <div className="absolute bg-[#faf8ff] content-stretch flex flex-col items-start left-0 pb-px right-0 top-0" data-name="Header - TopAppBar">
      <div aria-hidden className="absolute border-[#c5c5d3] border-b border-solid inset-0 pointer-events-none" />
      <Container33 />
    </div>
  );
}

export default function DonateWireframeDesktop() {
  return (
    <div className="relative size-full" data-name="Donate Wireframe (Desktop)">
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