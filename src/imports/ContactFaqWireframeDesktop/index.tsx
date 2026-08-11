function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Heading 1">
      <div aria-hidden className="absolute border-b-4 border-black border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[40px] text-black tracking-[-0.8px] uppercase whitespace-nowrap">
        <p className="leading-[48px]">{`SUPPORT & CONTACT`}</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-black uppercase w-full">
        <p className="leading-[28px]">FIND ANSWERS OR REACH OUT TO OUR TEAM.</p>
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Page Header">
      <Heading />
      <Container />
    </div>
  );
}

function PageHeaderMargin() {
  return (
    <div className="col-[1/span_12] content-stretch flex flex-col items-start justify-self-stretch pb-[40px] relative row-1 self-start shrink-0" data-name="Page Header:margin">
      <PageHeader />
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-b border-black border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[9px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[30px] text-black tracking-[-0.3px] uppercase whitespace-nowrap">
          <p className="leading-[38px]">EMERGENCY ASSISTANCE</p>
        </div>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black uppercase w-full">
          <p className="leading-[24px] mb-0">IF YOU HAVE FOUND A SEVERELY INJURED ANIMAL, PLEASE DO NOT</p>
          <p className="leading-[24px]">USE THIS FORM.</p>
        </div>
      </div>
    </div>
  );
}

function Border() {
  return (
    <div className="relative shrink-0 w-full" data-name="Border">
      <div aria-hidden className="absolute border-2 border-black border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center px-[18px] py-[10px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center uppercase whitespace-nowrap">
            <p className="leading-[24px]">CALL EMERGENCY HOTLINE (555) 019-9923</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmergencyRedirection() {
  return (
    <div className="relative shrink-0 w-full" data-name="Emergency Redirection">
      <div aria-hidden className="absolute border-4 border-black border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[28px] relative size-full">
        <HorizontalBorder />
        <Container1 />
        <Border />
      </div>
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-b border-black border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[9px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black uppercase whitespace-nowrap">
          <p className="leading-[32px]">FREQUENTLY ASKED QUESTIONS</p>
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pb-px relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] uppercase w-full">
          <p className="leading-[normal]">SEARCH FAQS...</p>
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center px-[13px] py-[12px] relative size-full">
          <Container2 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#6b7280] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Border1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Border">
      <div aria-hidden className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start p-[13px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black uppercase whitespace-nowrap">
          <p className="leading-[24px]">HOW DO I ADOPT A PET? [+]</p>
        </div>
      </div>
    </div>
  );
}

function Border2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Border">
      <div aria-hidden className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start p-[13px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black uppercase whitespace-nowrap">
          <p className="leading-[24px]">CAN I VOLUNTEER ON WEEKENDS? [+]</p>
        </div>
      </div>
    </div>
  );
}

function Border3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Border">
      <div aria-hidden className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start p-[13px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black uppercase whitespace-nowrap">
          <p className="leading-[24px]">ARE DONATIONS TAX DEDUCTIBLE? [+]</p>
        </div>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start pt-[12px] relative size-full">
        <Border1 />
        <Border2 />
        <Border3 />
      </div>
    </div>
  );
}

function SearchableFaq() {
  return (
    <div className="relative shrink-0 w-full" data-name="Searchable FAQ">
      <div aria-hidden className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[16px] items-start pb-[33px] pt-[25px] px-[25px] relative size-full">
        <HorizontalBorder1 />
        <Input />
        <Container3 />
      </div>
    </div>
  );
}

function LeftColumnFaqInfo() {
  return (
    <div className="col-[1/span_6] content-stretch flex flex-col gap-[24px] items-start justify-self-stretch pb-[214px] relative row-2 self-start shrink-0" data-name="Left Column: FAQ & Info">
      <EmergencyRedirection />
      <SearchableFaq />
    </div>
  );
}

function HorizontalBorder2() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-b border-black border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[9px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black uppercase whitespace-nowrap">
          <p className="leading-[32px]">SUBMIT AN INQUIRY</p>
        </div>
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black tracking-[0.7px] uppercase w-full">
        <p className="leading-[20px]">INQUIRY TYPE</p>
      </div>
    </div>
  );
}

function Image() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="image">
      <svg className="absolute block inset-0 size-full" fill="none" height="24" preserveAspectRatio="none" viewBox="0 0 24 24" width="24">
        <g id="image">
          <path d="M7.2 9.6L12 14.4L16.8 9.6" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </g>
      </svg>
    </div>
  );
}

function Container5() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black uppercase w-full">
          <p className="leading-[24px]">GENERAL SUPPORT</p>
        </div>
      </div>
    </div>
  );
}

function Options() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Options">
      <div aria-hidden className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[9px] relative size-full">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip pl-[497px] pr-[9px] py-[9px] relative rounded-[inherit] size-full">
            <Image />
          </div>
          <Container5 />
        </div>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start pb-[16px] relative shrink-0 w-full" data-name="Container">
      <Label />
      <Options />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black tracking-[0.7px] uppercase w-full">
        <p className="leading-[20px]">FIRST NAME</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pb-px relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] uppercase w-full">
          <p className="leading-[normal]">FIRST NAME</p>
        </div>
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center px-[13px] py-[12px] relative size-full">
          <Container8 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#6b7280] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px pb-[16px] relative" data-name="Container">
      <Label1 />
      <Input1 />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black tracking-[0.7px] uppercase w-full">
        <p className="leading-[20px]">LAST NAME</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pb-px relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] uppercase w-full">
          <p className="leading-[normal]">LAST NAME</p>
        </div>
      </div>
    </div>
  );
}

function Input2() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center px-[13px] py-[12px] relative size-full">
          <Container10 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#6b7280] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px pb-[16px] relative" data-name="Container">
      <Label2 />
      <Input2 />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex gap-[12px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container7 />
      <Container9 />
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black tracking-[0.7px] uppercase w-full">
        <p className="leading-[20px]">EMAIL ADDRESS</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pb-px relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] uppercase w-full">
          <p className="leading-[normal]">EMAIL@EXAMPLE.COM</p>
        </div>
      </div>
    </div>
  );
}

function Input3() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center px-[13px] py-[12px] relative size-full">
          <Container12 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#6b7280] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start pb-[16px] relative shrink-0 w-full" data-name="Container">
      <Label3 />
      <Input3 />
    </div>
  );
}

function Label4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black tracking-[0.7px] uppercase w-full">
        <p className="leading-[20px]">MESSAGE</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] uppercase w-full">
          <p className="leading-[24px]">PLEASE DESCRIBE YOUR INQUIRY IN DETAIL...</p>
        </div>
      </div>
    </div>
  );
}

function Textarea() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Textarea">
      <div className="flex flex-row justify-center overflow-auto rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[105px] pt-[9px] px-[9px] relative size-full">
          <Container14 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-black border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start pb-[23px] relative shrink-0 w-full" data-name="Container">
      <Label4 />
      <Textarea />
    </div>
  );
}

function Border5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Border">
      <div aria-hidden className="absolute border-2 border-black border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center px-[18px] py-[10px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center uppercase whitespace-nowrap">
            <p className="leading-[24px]">SUBMIT MESSAGE</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Form() {
  return (
    <div className="relative shrink-0 w-full" data-name="Form">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative size-full">
        <Container4 />
        <Container6 />
        <Container11 />
        <Container13 />
        <Border5 />
      </div>
    </div>
  );
}

function Border4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Border">
      <div aria-hidden className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[25px] relative size-full">
        <HorizontalBorder2 />
        <Form />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black tracking-[0.7px] uppercase w-full">
          <p className="leading-[20px]">EXPECTED RESPONSE TIMES</p>
        </div>
      </div>
    </div>
  );
}

function Item() {
  return (
    <div className="content-stretch flex gap-[13px] items-start relative shrink-0 w-full" data-name="Item">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[20px]">{` `}</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[20px]">GENERAL SUPPORT: 24-48 HOURS</p>
      </div>
    </div>
  );
}

function Item1() {
  return (
    <div className="content-stretch flex gap-[13px] items-start relative shrink-0 w-full" data-name="Item">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[20px]">{` `}</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[20px]">MEDIA INQUIRIES: SAME BUSINESS DAY</p>
      </div>
    </div>
  );
}

function Item2() {
  return (
    <div className="content-stretch flex gap-[13px] items-start relative shrink-0 w-full" data-name="Item">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[20px]">{` `}</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[20px]">PARTNERSHIPS: 3-5 BUSINESS DAYS</p>
      </div>
    </div>
  );
}

function List() {
  return (
    <div className="relative shrink-0 w-full" data-name="List">
      <div className="[word-break:break-word] bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col font-['Liberation_Serif:Regular',sans-serif] gap-[3.5px] items-start leading-[0] not-italic relative size-full text-[14px] text-black uppercase whitespace-nowrap">
        <Item />
        <Item1 />
        <Item2 />
      </div>
    </div>
  );
}

function ResponseTimeExpectations() {
  return (
    <div className="relative shrink-0 w-full" data-name="Response Time Expectations">
      <div aria-hidden className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[25px] relative size-full">
        <Container15 />
        <List />
      </div>
    </div>
  );
}

function RightColumnContactForm() {
  return (
    <div className="col-[7/span_6] content-stretch flex flex-col gap-[24px] items-start justify-self-stretch pb-[24px] relative row-2 self-start shrink-0" data-name="Right Column: Contact Form">
      <Border4 />
      <ResponseTimeExpectations />
    </div>
  );
}

function MainContentCanvas() {
  return (
    <div className="absolute gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(12,minmax(0,1fr))] grid-rows-[__144px_820px] left-0 px-[48px] py-[64px] right-0 top-[62px]" data-name="Main Content Canvas">
      <PageHeaderMargin />
      <LeftColumnFaqInfo />
      <RightColumnContactForm />
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black uppercase w-full">
        <p className="leading-[32px]">RESCUELINK</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black uppercase w-full">
        <p className="leading-[20px] mb-0">© 2024 ANIMAL WELFARE PUBLIC</p>
        <p className="leading-[20px] mb-0">SERVICE PLATFORM.</p>
        <p className="leading-[20px]">ALL RIGHTS RESERVED.</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative size-full">
        <Container17 />
        <Container18 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black tracking-[0.7px] uppercase w-full">
        <p className="leading-[20px]">LEGAL</p>
      </div>
    </div>
  );
}

function Item3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black uppercase w-full">
        <p className="leading-[20px]">PRIVACY POLICY</p>
      </div>
    </div>
  );
}

function Item4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black uppercase w-full">
        <p className="leading-[20px]">TERMS OF SERVICE</p>
      </div>
    </div>
  );
}

function List1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="List">
      <Item3 />
      <Item4 />
    </div>
  );
}

function Container19() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start pb-[28px] relative size-full">
        <Container20 />
        <List1 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black tracking-[0.7px] uppercase w-full">
        <p className="leading-[20px]">COMMUNITY</p>
      </div>
    </div>
  );
}

function Item5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black uppercase w-full">
        <p className="leading-[20px]">ACCESSIBILITY STATEMENT</p>
      </div>
    </div>
  );
}

function Item6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black uppercase w-full">
        <p className="leading-[20px]">COMMUNITY GUIDELINES</p>
      </div>
    </div>
  );
}

function List2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="List">
      <Item5 />
      <Item6 />
    </div>
  );
}

function Container21() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start pb-[28px] relative size-full">
        <Container22 />
        <List2 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black tracking-[0.7px] uppercase w-full">
        <p className="leading-[20px]">SUPPORT</p>
      </div>
    </div>
  );
}

function ListItem() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="List → Item">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black uppercase w-full">
        <p className="leading-[20px]">CONTACT US</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start pb-[52px] relative size-full">
        <Container24 />
        <ListItem />
      </div>
    </div>
  );
}

function GlobalFooterGrayscaleWireframe() {
  return (
    <div className="absolute content-stretch flex gap-[24px] items-start justify-center left-[48px] pb-[65px] pt-[68px] px-[49px] right-[48px] top-[1178px]" data-name="Global Footer (Grayscale Wireframe)">
      <div aria-hidden className="absolute border-b border-black border-l border-r border-solid border-t-4 inset-0 pointer-events-none" />
      <Container16 />
      <Container19 />
      <Container21 />
      <Container23 />
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black uppercase whitespace-nowrap">
          <p className="leading-[32px]">RESCUELINK</p>
        </div>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black uppercase whitespace-nowrap">
        <p className="leading-[24px]">FIND PETS</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px relative" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black uppercase whitespace-nowrap">
        <p className="leading-[24px]">SERVICES</p>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pl-[24px] relative self-stretch shrink-0" data-name="Margin">
      <Container28 />
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px relative" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black uppercase whitespace-nowrap">
        <p className="leading-[24px]">VOLUNTEER</p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pl-[24px] relative self-stretch shrink-0" data-name="Margin">
      <Container29 />
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px relative" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black uppercase whitespace-nowrap">
        <p className="leading-[24px]">DONATE</p>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pl-[24px] relative self-stretch shrink-0" data-name="Margin">
      <Container30 />
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[24px] relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <Container27 />
        <Margin />
        <Margin1 />
        <Margin2 />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black tracking-[0.7px] uppercase whitespace-nowrap">
        <p className="leading-[20px]">ACCOUNT</p>
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[12px] relative shrink-0" data-name="Margin">
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black tracking-[0.7px] uppercase whitespace-nowrap">
        <p className="leading-[20px]">NOTIFS</p>
      </div>
    </div>
  );
}

function Border6() {
  return (
    <div className="content-stretch flex flex-col items-center px-[18px] py-[10px] relative shrink-0" data-name="Border">
      <div aria-hidden className="absolute border-2 border-black border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Liberation_Serif:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center uppercase whitespace-nowrap">
        <p className="leading-[24px]">REPORT EMERGENCY</p>
      </div>
    </div>
  );
}

function Margin4() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[12px] relative shrink-0" data-name="Margin">
      <Border6 />
    </div>
  );
}

function Container31() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Container32 />
        <Margin3 />
        <Margin4 />
      </div>
    </div>
  );
}

function NavigationGrayscaleWireframe() {
  return (
    <div className="absolute bg-white content-stretch flex items-center justify-between left-0 pb-[10px] pl-[48px] pr-[47.99px] pt-[8px] right-0 top-0" data-name="Navigation (Grayscale Wireframe)">
      <div aria-hidden className="absolute border-b-2 border-black border-solid inset-0 pointer-events-none" />
      <Container25 />
      <Container26 />
      <Container31 />
    </div>
  );
}

export default function ContactFaqWireframeDesktop() {
  return (
    <div className="bg-white relative size-full" data-name="Contact & FAQ Wireframe (Desktop)">
      <MainContentCanvas />
      <GlobalFooterGrayscaleWireframe />
      <NavigationGrayscaleWireframe />
    </div>
  );
}