function Heading() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#111827] text-[40px] text-center tracking-[-0.8px] whitespace-nowrap">
        <p className="leading-[48px]">Find Your New Best Friend</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-center max-w-[672px] relative shrink-0 w-[672px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[18px] text-center whitespace-nowrap">
        <p className="leading-[28px] mb-0">Every animal deserves a loving home. Browse our current residents and find</p>
        <p className="leading-[28px] mb-0">the perfect match for your family. We are committed to matching each pet with</p>
        <p className="leading-[28px]">a safe and supportive environment.</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="max-w-[896px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-center max-w-[inherit] relative size-full">
        <Heading />
        <Container1 />
      </div>
    </div>
  );
}

function SectionHeaderMissionSummary() {
  return (
    <div className="bg-[#f3f4f6] relative shrink-0 w-full" data-name="Section - Header / Mission Summary">
      <div aria-hidden className="absolute border-[#d1d5db] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pb-[65px] pt-[64px] px-[192px] relative size-full">
        <Container />
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 2">
      <div aria-hidden className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[13px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#111827] text-[24px] whitespace-nowrap">
          <p className="leading-[32px]">Filters</p>
        </div>
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">Species</p>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[12px] relative shrink-0" data-name="Margin">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Dogs (42)</p>
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Label">
      <div className="bg-white relative rounded-[2px] shrink-0 size-[16px]" data-name="Input">
        <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </div>
      <Margin />
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[12px] relative shrink-0" data-name="Margin">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Cats (38)</p>
      </div>
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Label">
      <div className="bg-white relative rounded-[2px] shrink-0 size-[16px]" data-name="Input">
        <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </div>
      <Margin1 />
    </div>
  );
}

function Margin2() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[12px] relative shrink-0" data-name="Margin">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Other (12)</p>
      </div>
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Label">
      <div className="bg-white relative rounded-[2px] shrink-0 size-[16px]" data-name="Input">
        <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </div>
      <Margin2 />
    </div>
  );
}

function SpeciesFilter() {
  return (
    <div className="relative shrink-0 w-full" data-name="Species Filter">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative size-full">
        <Heading2 />
        <Label />
        <Label1 />
        <Label2 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">Age</p>
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[12px] relative shrink-0" data-name="Margin">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Puppy/Kitten (0-1 yr)</p>
      </div>
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Label">
      <div className="bg-white relative rounded-[2px] shrink-0 size-[16px]" data-name="Input">
        <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </div>
      <Margin3 />
    </div>
  );
}

function Margin4() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[12px] relative shrink-0" data-name="Margin">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Young (1-3 yrs)</p>
      </div>
    </div>
  );
}

function Label4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Label">
      <div className="bg-white relative rounded-[2px] shrink-0 size-[16px]" data-name="Input">
        <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </div>
      <Margin4 />
    </div>
  );
}

function Margin5() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[12px] relative shrink-0" data-name="Margin">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Adult (3-8 yrs)</p>
      </div>
    </div>
  );
}

function Label5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Label">
      <div className="bg-white relative rounded-[2px] shrink-0 size-[16px]" data-name="Input">
        <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </div>
      <Margin5 />
    </div>
  );
}

function Margin6() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[12px] relative shrink-0" data-name="Margin">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Senior (8+ yrs)</p>
      </div>
    </div>
  );
}

function Label6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Label">
      <div className="bg-white relative rounded-[2px] shrink-0 size-[16px]" data-name="Input">
        <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </div>
      <Margin6 />
    </div>
  );
}

function AgeFilter() {
  return (
    <div className="relative shrink-0 w-full" data-name="Age Filter">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start pt-[16px] relative size-full">
        <Heading3 />
        <Label3 />
        <Label4 />
        <Label5 />
        <Label6 />
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">Size</p>
      </div>
    </div>
  );
}

function Margin7() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[12px] relative shrink-0" data-name="Margin">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Small (0-25 lbs)</p>
      </div>
    </div>
  );
}

function Label7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Label">
      <div className="bg-white relative rounded-[2px] shrink-0 size-[16px]" data-name="Input">
        <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </div>
      <Margin7 />
    </div>
  );
}

function Margin8() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[12px] relative shrink-0" data-name="Margin">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Medium (26-60 lbs)</p>
      </div>
    </div>
  );
}

function Label8() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Label">
      <div className="bg-white relative rounded-[2px] shrink-0 size-[16px]" data-name="Input">
        <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </div>
      <Margin8 />
    </div>
  );
}

function Margin9() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[12px] relative shrink-0" data-name="Margin">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Large (61-100 lbs)</p>
      </div>
    </div>
  );
}

function Label9() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Label">
      <div className="bg-white relative rounded-[2px] shrink-0 size-[16px]" data-name="Input">
        <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </div>
      <Margin9 />
    </div>
  );
}

function Margin10() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[12px] relative shrink-0" data-name="Margin">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Extra Large (100+ lbs)</p>
      </div>
    </div>
  );
}

function Label10() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Label">
      <div className="bg-white relative rounded-[2px] shrink-0 size-[16px]" data-name="Input">
        <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </div>
      <Margin10 />
    </div>
  );
}

function SizeFilter() {
  return (
    <div className="relative shrink-0 w-full" data-name="Size Filter">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start pt-[16px] relative size-full">
        <Heading4 />
        <Label7 />
        <Label8 />
        <Label9 />
        <Label10 />
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[25px] relative size-full">
        <Heading1 />
        <SpeciesFilter />
        <AgeFilter />
        <SizeFilter />
      </div>
    </div>
  );
}

function AsideRobustFilterSidebar() {
  return (
    <div className="col-[1/span_3] content-stretch flex flex-col items-start justify-self-stretch pb-[245px] relative row-1 self-start shrink-0" data-name="Aside - Robust Filter Sidebar">
      <BackgroundBorder />
    </div>
  );
}

function BackgroundHorizontalBorder() {
  return (
    <div className="bg-[#e5e7eb] h-[192px] relative shrink-0 w-full" data-name="Background+HorizontalBorder">
      <div aria-hidden className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pb-px relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] text-center whitespace-nowrap">
          <p className="leading-[24px]">Image Placeholder</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex flex-col items-start px-[9px] py-[5px] relative rounded-[2px] shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Dog</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#111827] text-[24px] whitespace-nowrap">
          <p className="leading-[32px]">Bella</p>
        </div>
        <BackgroundBorder1 />
      </div>
    </div>
  );
}

function Margin11() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] relative shrink-0 w-full" data-name="Margin">
      <Container3 />
    </div>
  );
}

function Item() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p>
          <span className="leading-[20px]">Breed:</span>
          <span className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic">{` Mixed`}</span>
        </p>
      </div>
    </div>
  );
}

function Item1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p>
          <span className="leading-[20px]">Age:</span>
          <span className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic">{` 2 yrs`}</span>
        </p>
      </div>
    </div>
  );
}

function Item2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p>
          <span className="leading-[20px]">Size:</span>
          <span className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic">{` Medium`}</span>
        </p>
      </div>
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="List">
      <Item />
      <Item1 />
      <Item2 />
    </div>
  );
}

function ListMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="List:margin">
      <List />
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-px py-[9px] relative rounded-[2px] shrink-0 w-full" data-name="Button">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">View Details</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[24px] relative size-full">
        <Margin11 />
        <ListMargin />
        <Button />
      </div>
    </div>
  );
}

function ArticleCard() {
  return (
    <div className="bg-white col-1 justify-self-stretch relative rounded-[4px] row-1 self-start shrink-0" data-name="Article - Card 1">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <BackgroundHorizontalBorder />
        <Container2 />
      </div>
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function BackgroundHorizontalBorder1() {
  return (
    <div className="bg-[#e5e7eb] h-[192px] relative shrink-0 w-full" data-name="Background+HorizontalBorder">
      <div aria-hidden className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pb-px relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] text-center whitespace-nowrap">
          <p className="leading-[24px]">Image Placeholder</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex flex-col items-start px-[9px] py-[5px] relative rounded-[2px] shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Dog</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#111827] text-[24px] whitespace-nowrap">
          <p className="leading-[32px]">Max</p>
        </div>
        <BackgroundBorder2 />
      </div>
    </div>
  );
}

function Margin12() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] relative shrink-0 w-full" data-name="Margin">
      <Container5 />
    </div>
  );
}

function Item3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p>
          <span className="leading-[20px]">Breed:</span>
          <span className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic">{` Labrador`}</span>
        </p>
      </div>
    </div>
  );
}

function Item4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p>
          <span className="leading-[20px]">Age:</span>
          <span className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic">{` 5 yrs`}</span>
        </p>
      </div>
    </div>
  );
}

function Item5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p>
          <span className="leading-[20px]">Size:</span>
          <span className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic">{` Large`}</span>
        </p>
      </div>
    </div>
  );
}

function List1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="List">
      <Item3 />
      <Item4 />
      <Item5 />
    </div>
  );
}

function ListMargin1() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="List:margin">
      <List1 />
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-px py-[9px] relative rounded-[2px] shrink-0 w-full" data-name="Button">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">View Details</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[24px] relative size-full">
        <Margin12 />
        <ListMargin1 />
        <Button1 />
      </div>
    </div>
  );
}

function ArticleCard1() {
  return (
    <div className="bg-white col-2 justify-self-stretch relative rounded-[4px] row-1 self-start shrink-0" data-name="Article - Card 2">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <BackgroundHorizontalBorder1 />
        <Container4 />
      </div>
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function BackgroundHorizontalBorder2() {
  return (
    <div className="bg-[#e5e7eb] h-[192px] relative shrink-0 w-full" data-name="Background+HorizontalBorder">
      <div aria-hidden className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pb-px relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] text-center whitespace-nowrap">
          <p className="leading-[24px]">Image Placeholder</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex flex-col items-start px-[9px] py-[5px] relative rounded-[2px] shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Cat</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#111827] text-[24px] whitespace-nowrap">
          <p className="leading-[32px]">Luna</p>
        </div>
        <BackgroundBorder3 />
      </div>
    </div>
  );
}

function Margin13() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] relative shrink-0 w-full" data-name="Margin">
      <Container7 />
    </div>
  );
}

function Item6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p>
          <span className="leading-[20px]">Breed:</span>
          <span className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic">{` Domestic Shorthair`}</span>
        </p>
      </div>
    </div>
  );
}

function Item7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p>
          <span className="leading-[20px]">Age:</span>
          <span className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic">{` 1 yr`}</span>
        </p>
      </div>
    </div>
  );
}

function Item8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p>
          <span className="leading-[20px]">Size:</span>
          <span className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic">{` Small`}</span>
        </p>
      </div>
    </div>
  );
}

function List2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="List">
      <Item6 />
      <Item7 />
      <Item8 />
    </div>
  );
}

function ListMargin2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="List:margin">
      <List2 />
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-px py-[9px] relative rounded-[2px] shrink-0 w-full" data-name="Button">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">View Details</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[24px] relative size-full">
        <Margin13 />
        <ListMargin2 />
        <Button2 />
      </div>
    </div>
  );
}

function ArticleCard2() {
  return (
    <div className="bg-white col-3 justify-self-stretch relative rounded-[4px] row-1 self-start shrink-0" data-name="Article - Card 3">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <BackgroundHorizontalBorder2 />
        <Container6 />
      </div>
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function BackgroundHorizontalBorder3() {
  return (
    <div className="bg-[#e5e7eb] h-[192px] relative shrink-0 w-full" data-name="Background+HorizontalBorder">
      <div aria-hidden className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pb-px relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] text-center whitespace-nowrap">
          <p className="leading-[24px]">Image Placeholder</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder4() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex flex-col items-start px-[9px] py-[5px] relative rounded-[2px] shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Dog</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#111827] text-[24px] whitespace-nowrap">
          <p className="leading-[32px]">Charlie</p>
        </div>
        <BackgroundBorder4 />
      </div>
    </div>
  );
}

function Margin14() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] relative shrink-0 w-full" data-name="Margin">
      <Container9 />
    </div>
  );
}

function Item9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p>
          <span className="leading-[20px]">Breed:</span>
          <span className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic">{` Terrier Mix`}</span>
        </p>
      </div>
    </div>
  );
}

function Item10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p>
          <span className="leading-[20px]">Age:</span>
          <span className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic">{` 6 mos`}</span>
        </p>
      </div>
    </div>
  );
}

function Item11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p>
          <span className="leading-[20px]">Size:</span>
          <span className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic">{` Small`}</span>
        </p>
      </div>
    </div>
  );
}

function List3() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="List">
      <Item9 />
      <Item10 />
      <Item11 />
    </div>
  );
}

function ListMargin3() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="List:margin">
      <List3 />
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-px py-[9px] relative rounded-[2px] shrink-0 w-full" data-name="Button">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">View Details</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[24px] relative size-full">
        <Margin14 />
        <ListMargin3 />
        <Button3 />
      </div>
    </div>
  );
}

function ArticleCard3() {
  return (
    <div className="bg-white col-1 justify-self-stretch relative rounded-[4px] row-2 self-start shrink-0" data-name="Article - Card 4">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <BackgroundHorizontalBorder3 />
        <Container8 />
      </div>
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function BackgroundHorizontalBorder4() {
  return (
    <div className="bg-[#e5e7eb] h-[192px] relative shrink-0 w-full" data-name="Background+HorizontalBorder">
      <div aria-hidden className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pb-px relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] text-center whitespace-nowrap">
          <p className="leading-[24px]">Image Placeholder</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder5() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex flex-col items-start px-[9px] py-[5px] relative rounded-[2px] shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Cat</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#111827] text-[24px] whitespace-nowrap">
          <p className="leading-[32px]">Oliver</p>
        </div>
        <BackgroundBorder5 />
      </div>
    </div>
  );
}

function Margin15() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] relative shrink-0 w-full" data-name="Margin">
      <Container11 />
    </div>
  );
}

function Item12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p>
          <span className="leading-[20px]">Breed:</span>
          <span className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic">{` Maine Coon Mix`}</span>
        </p>
      </div>
    </div>
  );
}

function Item13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p>
          <span className="leading-[20px]">Age:</span>
          <span className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic">{` 4 yrs`}</span>
        </p>
      </div>
    </div>
  );
}

function Item14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p>
          <span className="leading-[20px]">Size:</span>
          <span className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic">{` Medium`}</span>
        </p>
      </div>
    </div>
  );
}

function List4() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="List">
      <Item12 />
      <Item13 />
      <Item14 />
    </div>
  );
}

function ListMargin4() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="List:margin">
      <List4 />
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-px py-[9px] relative rounded-[2px] shrink-0 w-full" data-name="Button">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">View Details</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[24px] relative size-full">
        <Margin15 />
        <ListMargin4 />
        <Button4 />
      </div>
    </div>
  );
}

function ArticleCard4() {
  return (
    <div className="bg-white col-2 justify-self-stretch relative rounded-[4px] row-2 self-start shrink-0" data-name="Article - Card 5">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <BackgroundHorizontalBorder4 />
        <Container10 />
      </div>
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function BackgroundHorizontalBorder5() {
  return (
    <div className="bg-[#e5e7eb] h-[192px] relative shrink-0 w-full" data-name="Background+HorizontalBorder">
      <div aria-hidden className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pb-px relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] text-center whitespace-nowrap">
          <p className="leading-[24px]">Image Placeholder</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder6() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex flex-col items-start px-[9px] py-[5px] relative rounded-[2px] shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Dog</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#111827] text-[24px] whitespace-nowrap">
        <p className="leading-[32px]">Daisy</p>
      </div>
      <BackgroundBorder6 />
    </div>
  );
}

function Margin16() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] relative shrink-0 w-full" data-name="Margin">
      <Container13 />
    </div>
  );
}

function Item15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p>
          <span className="leading-[20px]">Breed:</span>
          <span className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic">{` Beagle`}</span>
        </p>
      </div>
    </div>
  );
}

function Item16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p>
          <span className="leading-[20px]">Age:</span>
          <span className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic">{` 7 yrs`}</span>
        </p>
      </div>
    </div>
  );
}

function Item17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p>
          <span className="leading-[20px]">Size:</span>
          <span className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic">{` Medium`}</span>
        </p>
      </div>
    </div>
  );
}

function List5() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="List">
      <Item15 />
      <Item16 />
      <Item17 />
    </div>
  );
}

function ListMargin5() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="List:margin">
      <List5 />
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-px py-[9px] relative rounded-[2px] shrink-0 w-full" data-name="Button">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">View Details</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[24px] relative size-full">
        <Margin16 />
        <ListMargin5 />
        <Button5 />
      </div>
    </div>
  );
}

function ArticleCard5() {
  return (
    <div className="bg-white col-3 justify-self-stretch relative rounded-[4px] row-2 self-start shrink-0" data-name="Article - Card 6">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <BackgroundHorizontalBorder5 />
        <Container12 />
      </div>
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function AnimalCardGrid() {
  return (
    <div className="col-[4/span_9] gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[__416px_416px] justify-self-stretch relative row-1 self-start shrink-0" data-name="Animal Card Grid">
      <ArticleCard />
      <ArticleCard1 />
      <ArticleCard2 />
      <ArticleCard3 />
      <ArticleCard4 />
      <ArticleCard5 />
    </div>
  );
}

function SectionMainListingArea() {
  return (
    <div className="max-w-[1280px] relative shrink-0 w-full" data-name="Section - Main Listing Area">
      <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(12,minmax(0,1fr))] grid-rows-[_856px] max-w-[inherit] px-[48px] py-[40px] relative size-full">
        <AsideRobustFilterSidebar />
        <AnimalCardGrid />
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#111827] text-[30px] text-center tracking-[-0.3px] whitespace-nowrap">
        <p className="leading-[38px]">Adoption Process Overview</p>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[64px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">1</p>
      </div>
    </div>
  );
}

function Margin17() {
  return (
    <div className="h-[76px] relative shrink-0 w-[64px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] relative size-full">
        <Background />
      </div>
    </div>
  );
}

function Heading6() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Find a Match</p>
      </div>
    </div>
  );
}

function Heading3Margin() {
  return (
    <div className="relative shrink-0" data-name="Heading 3:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[4px] relative size-full">
        <Heading6 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center px-[8.19px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] text-center whitespace-nowrap">
          <p className="leading-[20px] mb-0">Browse our listings and find an</p>
          <p className="leading-[20px]">animal that fits your lifestyle.</p>
        </div>
      </div>
    </div>
  );
}

function Step() {
  return (
    <div className="flex-[1_0_0] min-w-px relative rounded-[2px]" data-name="Step 1">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center pb-[45px] pt-[25px] px-[25px] relative size-full">
          <Margin17 />
          <Heading3Margin />
          <Container16 />
        </div>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[64px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">2</p>
      </div>
    </div>
  );
}

function Margin18() {
  return (
    <div className="h-[76px] relative shrink-0 w-[64px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] relative size-full">
        <Background1 />
      </div>
    </div>
  );
}

function Heading7() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Submit Application</p>
      </div>
    </div>
  );
}

function Heading3Margin1() {
  return (
    <div className="relative shrink-0" data-name="Heading 3:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[4px] relative size-full">
        <Heading7 />
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pl-[1.38px] pr-[1.37px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] text-center whitespace-nowrap">
          <p className="leading-[20px] mb-0">Fill out an online application to</p>
          <p className="leading-[20px]">provide details about your home.</p>
        </div>
      </div>
    </div>
  );
}

function Step1() {
  return (
    <div className="flex-[1_0_0] min-w-px relative rounded-[2px]" data-name="Step 2">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center pb-[45px] pt-[25px] px-[25px] relative size-full">
          <Margin18 />
          <Heading3Margin1 />
          <Container17 />
        </div>
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[64px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">3</p>
      </div>
    </div>
  );
}

function Margin19() {
  return (
    <div className="h-[76px] relative shrink-0 w-[64px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] relative size-full">
        <Background2 />
      </div>
    </div>
  );
}

function Heading8() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">{`Meet & Greet`}</p>
      </div>
    </div>
  );
}

function Heading3Margin2() {
  return (
    <div className="relative shrink-0" data-name="Heading 3:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[4px] relative size-full">
        <Heading8 />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center px-[9.02px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] text-center whitespace-nowrap">
          <p className="leading-[20px] mb-0">Schedule a time to meet the</p>
          <p className="leading-[20px]">animal in person at our facility.</p>
        </div>
      </div>
    </div>
  );
}

function Step2() {
  return (
    <div className="flex-[1_0_0] min-w-px relative rounded-[2px]" data-name="Step 3">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center pb-[45px] pt-[25px] px-[25px] relative size-full">
          <Margin19 />
          <Heading3Margin2 />
          <Container18 />
        </div>
      </div>
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[64px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">4</p>
      </div>
    </div>
  );
}

function Margin20() {
  return (
    <div className="h-[76px] relative shrink-0 w-[64px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] relative size-full">
        <Background3 />
      </div>
    </div>
  );
}

function Heading9() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Take Them Home</p>
      </div>
    </div>
  );
}

function Heading3Margin3() {
  return (
    <div className="relative shrink-0" data-name="Heading 3:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[4px] relative size-full">
        <Heading9 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center px-[11.91px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] text-center whitespace-nowrap">
          <p className="leading-[20px] mb-0">Complete the paperwork, pay</p>
          <p className="leading-[20px] mb-0">the fee, and bring your new</p>
          <p className="leading-[20px]">friend home.</p>
        </div>
      </div>
    </div>
  );
}

function Step3() {
  return (
    <div className="flex-[1_0_0] min-w-px relative rounded-[2px]" data-name="Step 4">
      <div aria-hidden className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center p-[25px] relative size-full">
          <Margin20 />
          <Heading3Margin3 />
          <Container19 />
        </div>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex gap-[24px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Step />
      <Step1 />
      <Step2 />
      <Step3 />
    </div>
  );
}

function Container14() {
  return (
    <div className="max-w-[1152px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[40px] items-start max-w-[inherit] relative size-full">
        <Heading5 />
        <Container15 />
      </div>
    </div>
  );
}

function SectionAdoptionProcessOverview() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Section - Adoption Process Overview">
      <div aria-hidden className="absolute border-[#d1d5db] border-solid border-t inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pb-[64px] pt-[65px] px-[64px] relative size-full">
        <Container14 />
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-0 right-0 top-[57px]" data-name="Main Content">
      <SectionHeaderMissionSummary />
      <SectionMainListingArea />
      <SectionAdoptionProcessOverview />
    </div>
  );
}

function Brand() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Brand">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#111827] text-[24px] w-full">
        <p className="leading-[32px]">RescueLink</p>
      </div>
    </div>
  );
}

function BrandMargin() {
  return (
    <div className="col-[1/span_4] content-stretch flex flex-col items-start justify-self-stretch pb-[24px] relative row-1 self-start shrink-0" data-name="Brand:margin">
      <Brand />
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">Legal</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p className="leading-[20px]">Privacy Policy</p>
      </div>
    </div>
  );
}

function LinkMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[12px] relative shrink-0 w-full" data-name="Link:margin">
      <Link />
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p className="leading-[20px]">Terms of Service</p>
      </div>
    </div>
  );
}

function LinkMargin1() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[12px] relative shrink-0 w-full" data-name="Link:margin">
      <Link1 />
    </div>
  );
}

function LinksColumn() {
  return (
    <div className="col-1 content-stretch flex flex-col items-start justify-self-stretch relative row-2 self-start shrink-0" data-name="Links Column 1">
      <Container21 />
      <LinkMargin />
      <LinkMargin1 />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">Information</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p className="leading-[20px]">Accessibility Statement</p>
      </div>
    </div>
  );
}

function LinkMargin2() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[12px] relative shrink-0 w-full" data-name="Link:margin">
      <Link2 />
    </div>
  );
}

function Link3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p className="leading-[20px]">Community Guidelines</p>
      </div>
    </div>
  );
}

function LinkMargin3() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[12px] relative shrink-0 w-full" data-name="Link:margin">
      <Link3 />
    </div>
  );
}

function LinksColumn1() {
  return (
    <div className="col-2 content-stretch flex flex-col items-start justify-self-stretch relative row-2 self-start shrink-0" data-name="Links Column 2">
      <Container22 />
      <LinkMargin2 />
      <LinkMargin3 />
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">Support</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p className="leading-[20px]">Contact Us</p>
      </div>
    </div>
  );
}

function LinkMargin4() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[12px] relative shrink-0 w-full" data-name="Link:margin">
      <Link4 />
    </div>
  );
}

function LinksColumn2() {
  return (
    <div className="col-3 content-stretch flex flex-col items-start justify-self-stretch pb-[32px] relative row-2 self-start shrink-0" data-name="Links Column 3">
      <Container23 />
      <LinkMargin4 />
    </div>
  );
}

function Container24() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] w-full">
          <p className="leading-[20px]">© 2024 Animal Welfare Public Service Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

function Copyright() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[25px] relative shrink-0 w-full" data-name="Copyright">
      <div aria-hidden className="absolute border-[#d1d5db] border-solid border-t inset-0 pointer-events-none" />
      <Container24 />
    </div>
  );
}

function CopyrightMargin() {
  return (
    <div className="col-[1/span_4] content-stretch flex flex-col items-start justify-self-stretch pt-[40px] relative row-3 self-start shrink-0" data-name="Copyright:margin">
      <Copyright />
    </div>
  );
}

function Container20() {
  return (
    <div className="max-w-[1280px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[___56px_84px_85px] max-w-[inherit] px-[48px] py-[64px] relative size-full">
        <BrandMargin />
        <LinksColumn />
        <LinksColumn1 />
        <LinksColumn2 />
        <CopyrightMargin />
      </div>
    </div>
  );
}

function GlobalFooterFooterSharedComponentMapping() {
  return (
    <div className="absolute bg-[#f3f4f6] bottom-0 content-stretch flex flex-col items-start left-0 pt-px right-0" data-name="Global Footer (Footer Shared Component Mapping)">
      <div aria-hidden className="absolute border-[#d1d5db] border-solid border-t inset-0 pointer-events-none" />
      <Container20 />
    </div>
  );
}

function Brand1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Brand">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#111827] text-[24px] whitespace-nowrap">
        <p className="leading-[32px]">RescueLink</p>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="relative self-stretch shrink-0" data-name="Link">
      <div aria-hidden className="absolute border-[#111827] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pb-[6px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#111827] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Find Pets</p>
        </div>
      </div>
    </div>
  );
}

function Link6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px relative" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Services</p>
      </div>
    </div>
  );
}

function LinkMargin5() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pl-[24px] relative self-stretch shrink-0" data-name="Link:margin">
      <Link6 />
    </div>
  );
}

function Link7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px relative" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Volunteer</p>
      </div>
    </div>
  );
}

function LinkMargin6() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pl-[24px] relative self-stretch shrink-0" data-name="Link:margin">
      <Link7 />
    </div>
  );
}

function Link8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px relative" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Donate</p>
      </div>
    </div>
  );
}

function LinkMargin7() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pl-[24px] relative self-stretch shrink-0" data-name="Link:margin">
      <Link8 />
    </div>
  );
}

function NavLinks() {
  return (
    <div className="content-stretch flex h-[30px] items-start relative shrink-0" data-name="Nav - Links">
      <Link5 />
      <LinkMargin5 />
      <LinkMargin6 />
      <LinkMargin7 />
    </div>
  );
}

function SearchPlaceholder() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex h-[40px] items-center justify-center relative rounded-[2px] shrink-0 w-[128px]" data-name="Search Placeholder">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">Search...</p>
      </div>
    </div>
  );
}

function ButtonTrailingPrimaryAction() {
  return (
    <div className="bg-[#374151] content-stretch flex flex-col items-center justify-center px-[16px] py-[8px] relative rounded-[2px] shrink-0" data-name="Button - Trailing Primary Action">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#f9fafb] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Report Emergency</p>
      </div>
    </div>
  );
}

function ButtonTrailingPrimaryActionMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[12px] relative shrink-0" data-name="Button - Trailing Primary Action:margin">
      <ButtonTrailingPrimaryAction />
    </div>
  );
}

function TrailingIconsPlaceholders() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[32px]" data-name="Trailing Icons Placeholders">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">I</p>
      </div>
    </div>
  );
}

function TrailingIconsPlaceholdersMargin() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start pl-[12px] relative shrink-0 w-[44px]" data-name="Trailing Icons Placeholders:margin">
      <TrailingIconsPlaceholders />
    </div>
  );
}

function Background4() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[32px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">I</p>
      </div>
    </div>
  );
}

function Margin21() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start pl-[12px] relative shrink-0 w-[44px]" data-name="Margin">
      <Background4 />
    </div>
  );
}

function Actions() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Actions">
      <SearchPlaceholder />
      <ButtonTrailingPrimaryActionMargin />
      <TrailingIconsPlaceholdersMargin />
      <Margin21 />
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[48px] py-[8px] relative size-full">
          <Brand1 />
          <NavLinks />
          <Actions />
        </div>
      </div>
    </div>
  );
}

function HeaderNavigationTopAppBarSharedComponentMapping() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-start left-0 pb-px right-0 top-0" data-name="Header - Navigation (TopAppBar Shared Component Mapping)">
      <div aria-hidden className="absolute border-[#d1d5db] border-b border-solid inset-0 pointer-events-none" />
      <Container25 />
    </div>
  );
}

export default function AdoptionListingWireframeDesktop() {
  return (
    <div className="relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(249, 250, 251) 0%, rgb(249, 250, 251) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Adoption Listing Wireframe (Desktop)">
      <MainContent />
      <GlobalFooterFooterSharedComponentMapping />
      <HeaderNavigationTopAppBarSharedComponentMapping />
    </div>
  );
}