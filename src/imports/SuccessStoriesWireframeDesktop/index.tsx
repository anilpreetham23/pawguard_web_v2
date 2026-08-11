function Heading() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[40px] tracking-[-0.8px] w-full">
          <p className="leading-[48px]">Success Stories</p>
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[18px] w-full">
          <p className="leading-[28px]">Life after adoption.</p>
        </div>
      </div>
    </div>
  );
}

function PageTitle() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start pb-[13px] relative shrink-0 w-full" data-name="Page Title">
      <div aria-hidden className="absolute border-[#d1d5db] border-b border-solid inset-0 pointer-events-none" />
      <Heading />
      <Container />
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Image Placeholder (Featured Story)</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex h-[384px] items-center justify-center p-px relative rounded-[4px] shrink-0 w-[773.36px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container1 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[30px] tracking-[-0.3px] w-full">
        <p className="leading-[38px]">Featured Story Headline</p>
      </div>
    </div>
  );
}

function Heading2Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[24px] relative shrink-0 w-full" data-name="Heading 2:margin">
      <Heading1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Container">
      <div className="bg-[#e0e0e0] h-[16px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
      <div className="bg-[#e0e0e0] h-[16px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
      <div className="bg-[#e0e0e0] h-[16px] relative rounded-[2px] shrink-0 w-[322.19px]" data-name="Background" />
      <div className="bg-[#e0e0e0] h-[16px] relative rounded-[2px] shrink-0 w-[257.75px]" data-name="Background" />
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container3 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex flex-col items-center justify-center px-[25px] py-[13px] relative rounded-[2px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Read Full Story</p>
      </div>
    </div>
  );
}

function ButtonMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[24px] relative shrink-0" data-name="Button:margin">
      <Button />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative self-stretch shrink-0 w-[386.64px]" data-name="Container">
      <div className="bg-[#e0e0e0] h-[24px] relative rounded-[2px] shrink-0 w-[96px]" data-name="Background" />
      <Heading2Margin />
      <Margin />
      <ButtonMargin />
    </div>
  );
}

function SectionFeaturedHappyTailStory() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full" data-name="Section - Featured 'Happy Tail' Story">
      <BackgroundBorder />
      <Container2 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[13px] relative shrink-0 w-full" data-name="Heading 3">
      <div aria-hidden className="absolute border-[#d1d5db] border-b border-solid inset-0 pointer-events-none" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[24px] whitespace-nowrap">
        <p className="leading-[32px]">Recent Updates</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Img Placeholder</p>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#d1d5db] content-stretch flex h-[192px] items-center justify-center relative rounded-[2px] shrink-0 w-full" data-name="Background">
      <Container5 />
    </div>
  );
}

function Margin1() {
  return (
    <div className="h-[204px] relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] relative size-full">
        <Background />
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="h-[36px] relative shrink-0 w-[246.48px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="bg-[#e0e0e0] h-[24px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="bg-[#e0e0e0] h-[16px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
      </div>
    </div>
  );
}

function Margin4() {
  return (
    <div className="h-[28px] relative shrink-0 w-[219.09px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="bg-[#e0e0e0] h-[16px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
      </div>
    </div>
  );
}

function GridItem() {
  return (
    <div className="bg-[#f5f5f5] col-1 justify-self-stretch relative rounded-[4px] row-1 self-start shrink-0" data-name="Grid Item 1">
      <div aria-hidden className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="content-stretch flex flex-col items-start p-[25px] relative size-full">
        <Margin1 />
        <Margin2 />
        <Margin3 />
        <Margin4 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Img Placeholder</p>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#d1d5db] content-stretch flex h-[192px] items-center justify-center relative rounded-[2px] shrink-0 w-full" data-name="Background">
      <Container6 />
    </div>
  );
}

function Margin5() {
  return (
    <div className="h-[204px] relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] relative size-full">
        <Background1 />
      </div>
    </div>
  );
}

function Margin6() {
  return (
    <div className="h-[36px] relative shrink-0 w-[246.5px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="bg-[#e0e0e0] h-[24px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
      </div>
    </div>
  );
}

function Margin7() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="bg-[#e0e0e0] h-[16px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
      </div>
    </div>
  );
}

function Margin8() {
  return (
    <div className="h-[28px] relative shrink-0 w-[219.11px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="bg-[#e0e0e0] h-[16px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
      </div>
    </div>
  );
}

function GridItem1() {
  return (
    <div className="bg-[#f5f5f5] col-2 justify-self-stretch relative rounded-[4px] row-1 self-start shrink-0" data-name="Grid Item 2">
      <div aria-hidden className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="content-stretch flex flex-col items-start p-[25px] relative size-full">
        <Margin5 />
        <Margin6 />
        <Margin7 />
        <Margin8 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Img Placeholder</p>
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#d1d5db] content-stretch flex h-[192px] items-center justify-center relative rounded-[2px] shrink-0 w-full" data-name="Background">
      <Container7 />
    </div>
  );
}

function Margin9() {
  return (
    <div className="h-[204px] relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] relative size-full">
        <Background2 />
      </div>
    </div>
  );
}

function Margin10() {
  return (
    <div className="h-[36px] relative shrink-0 w-[246.48px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="bg-[#e0e0e0] h-[24px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
      </div>
    </div>
  );
}

function Margin11() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="bg-[#e0e0e0] h-[16px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
      </div>
    </div>
  );
}

function Margin12() {
  return (
    <div className="h-[28px] relative shrink-0 w-[219.09px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="bg-[#e0e0e0] h-[16px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
      </div>
    </div>
  );
}

function GridItem2() {
  return (
    <div className="bg-[#f5f5f5] col-3 justify-self-stretch relative rounded-[4px] row-1 self-start shrink-0" data-name="Grid Item 3">
      <div aria-hidden className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="content-stretch flex flex-col items-start p-[25px] relative size-full">
        <Margin9 />
        <Margin10 />
        <Margin11 />
        <Margin12 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Img Placeholder</p>
      </div>
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#d1d5db] content-stretch flex h-[192px] items-center justify-center relative rounded-[2px] shrink-0 w-full" data-name="Background">
      <Container8 />
    </div>
  );
}

function Margin13() {
  return (
    <div className="h-[204px] relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] relative size-full">
        <Background3 />
      </div>
    </div>
  );
}

function Margin14() {
  return (
    <div className="h-[36px] relative shrink-0 w-[246.48px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="bg-[#e0e0e0] h-[24px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
      </div>
    </div>
  );
}

function Margin15() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="bg-[#e0e0e0] h-[16px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
      </div>
    </div>
  );
}

function Margin16() {
  return (
    <div className="h-[28px] relative shrink-0 w-[219.09px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="bg-[#e0e0e0] h-[16px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
      </div>
    </div>
  );
}

function GridItem3() {
  return (
    <div className="bg-[#f5f5f5] col-1 justify-self-stretch relative rounded-[4px] row-2 self-start shrink-0" data-name="Grid Item 4">
      <div aria-hidden className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="content-stretch flex flex-col items-start p-[25px] relative size-full">
        <Margin13 />
        <Margin14 />
        <Margin15 />
        <Margin16 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Img Placeholder</p>
      </div>
    </div>
  );
}

function Background4() {
  return (
    <div className="bg-[#d1d5db] content-stretch flex h-[192px] items-center justify-center relative rounded-[2px] shrink-0 w-full" data-name="Background">
      <Container9 />
    </div>
  );
}

function Margin17() {
  return (
    <div className="h-[204px] relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] relative size-full">
        <Background4 />
      </div>
    </div>
  );
}

function Margin18() {
  return (
    <div className="h-[36px] relative shrink-0 w-[246.5px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="bg-[#e0e0e0] h-[24px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
      </div>
    </div>
  );
}

function Margin19() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="bg-[#e0e0e0] h-[16px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
      </div>
    </div>
  );
}

function Margin20() {
  return (
    <div className="h-[28px] relative shrink-0 w-[219.11px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="bg-[#e0e0e0] h-[16px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
      </div>
    </div>
  );
}

function GridItem4() {
  return (
    <div className="bg-[#f5f5f5] col-2 justify-self-stretch relative rounded-[4px] row-2 self-start shrink-0" data-name="Grid Item 5">
      <div aria-hidden className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="content-stretch flex flex-col items-start p-[25px] relative size-full">
        <Margin17 />
        <Margin18 />
        <Margin19 />
        <Margin20 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Img Placeholder</p>
      </div>
    </div>
  );
}

function Background5() {
  return (
    <div className="bg-[#d1d5db] content-stretch flex h-[192px] items-center justify-center relative rounded-[2px] shrink-0 w-full" data-name="Background">
      <Container10 />
    </div>
  );
}

function Margin21() {
  return (
    <div className="h-[204px] relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] relative size-full">
        <Background5 />
      </div>
    </div>
  );
}

function Margin22() {
  return (
    <div className="h-[36px] relative shrink-0 w-[246.48px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="bg-[#e0e0e0] h-[24px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
      </div>
    </div>
  );
}

function Margin23() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="bg-[#e0e0e0] h-[16px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
      </div>
    </div>
  );
}

function Margin24() {
  return (
    <div className="h-[28px] relative shrink-0 w-[219.09px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <div className="bg-[#e0e0e0] h-[16px] relative rounded-[2px] shrink-0 w-full" data-name="Background" />
      </div>
    </div>
  );
}

function GridItem5() {
  return (
    <div className="bg-[#f5f5f5] col-3 justify-self-stretch relative rounded-[4px] row-2 self-start shrink-0" data-name="Grid Item 6">
      <div aria-hidden className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="content-stretch flex flex-col items-start p-[25px] relative size-full">
        <Margin21 />
        <Margin22 />
        <Margin23 />
        <Margin24 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[__346px_346px] relative shrink-0 w-full" data-name="Container">
      <GridItem />
      <GridItem1 />
      <GridItem2 />
      <GridItem3 />
      <GridItem4 />
      <GridItem5 />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center px-[25px] py-[13px] relative rounded-[2px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Load More Stories</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex items-start justify-center pt-[16px] relative shrink-0 w-full" data-name="Container">
      <Button1 />
    </div>
  );
}

function SectionGridOfAdoptionUpdates() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Section - Grid of adoption updates">
      <Heading2 />
      <Container4 />
      <Container11 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="relative shrink-0" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[30px] text-center tracking-[-0.3px] whitespace-nowrap">
          <p className="leading-[38px]">Did you adopt from us?</p>
        </div>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-center max-w-[672px] px-[8.28px] relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[18px] text-center whitespace-nowrap">
        <p className="leading-[28px] mb-0">We love hearing about our alumni. Share your adoption story and help inspire</p>
        <p className="leading-[28px]">others to open their homes to animals in need.</p>
      </div>
    </div>
  );
}

function Margin25() {
  return (
    <div className="max-w-[672px] relative shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start max-w-[inherit] pt-[24px] relative size-full">
        <Container12 />
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#1f2937] content-stretch flex flex-col items-center justify-center px-[64px] py-[12px] relative rounded-[2px] shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Share Your Story CTA</p>
      </div>
    </div>
  );
}

function ButtonMargin1() {
  return (
    <div className="relative shrink-0" data-name="Button:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[24px] relative size-full">
        <Button2 />
      </div>
    </div>
  );
}

function SectionShareYourStoryCta() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[4px] shrink-0 w-full" data-name="Section - Share Your Story' CTA">
      <div aria-hidden className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center p-[65px] relative size-full">
          <Heading3 />
          <Margin25 />
          <ButtonMargin1 />
        </div>
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[24px] whitespace-nowrap">
        <p className="leading-[32px]">Ready for your own success story?</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Browse animals currently looking for their forever homes.</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="relative shrink-0 w-[432.41px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading4 />
        <Container14 />
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#e5e7eb] relative rounded-[2px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[25px] py-[13px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
          <p className="leading-[20px]">View Adoptable Animals</p>
        </div>
      </div>
    </div>
  );
}

function SectionFeedBackToAdoptableAnimals() {
  return (
    <div className="content-stretch flex items-center justify-between pt-[41px] relative shrink-0 w-full" data-name="Section - Feed back to Adoptable Animals">
      <div aria-hidden className="absolute border-[#d1d5db] border-solid border-t inset-0 pointer-events-none" />
      <Container13 />
      <Button3 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[64px] items-start left-0 max-w-[1280px] px-[48px] py-[64px] right-0 top-[65px]" data-name="Main Content">
      <PageTitle />
      <SectionFeaturedHappyTailStory />
      <SectionGridOfAdoptionUpdates />
      <SectionShareYourStoryCta />
      <SectionFeedBackToAdoptableAnimals />
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[24px] w-full">
        <p className="leading-[32px]">RescueLink</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-full">
        <p className="leading-[16px] mb-0">© 2024 Animal Welfare Public Service Platform.</p>
        <p className="leading-[16px]">All rights reserved.</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px pb-[12px] relative" data-name="Container">
      <Container17 />
      <Container18 />
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">Links</p>
      </div>
    </div>
  );
}

function Margin26() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[4px] relative shrink-0 w-full" data-name="Margin">
      <Container20 />
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

function Container19() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Margin26 />
      <LinkMargin />
      <LinkMargin1 />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">More</p>
      </div>
    </div>
  );
}

function Margin27() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[4px] relative shrink-0 w-full" data-name="Margin">
      <Container22 />
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

function Container21() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Margin27 />
      <LinkMargin2 />
      <LinkMargin3 />
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] tracking-[0.7px] w-full">
        <p className="leading-[20px]">Contact</p>
      </div>
    </div>
  );
}

function Margin28() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[4px] relative shrink-0 w-full" data-name="Margin">
      <Container24 />
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

function Container23() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px pb-[32px] relative" data-name="Container">
      <Margin28 />
      <LinkMargin4 />
    </div>
  );
}

function Container15() {
  return (
    <div className="max-w-[1280px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row justify-center max-w-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-start justify-center max-w-[inherit] px-[48px] py-[64px] relative size-full">
          <Container16 />
          <Container19 />
          <Container21 />
          <Container23 />
        </div>
      </div>
    </div>
  );
}

function FooterWireframe() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex flex-col items-start pt-px relative shrink-0 w-full" data-name="Footer Wireframe">
      <div aria-hidden className="absolute border-[#d1d5db] border-solid border-t inset-0 pointer-events-none" />
      <Container15 />
    </div>
  );
}

function FooterWireframeMargin() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[64px] right-0 top-[2214px]" data-name="Footer Wireframe:margin">
      <FooterWireframe />
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[24px] whitespace-nowrap">
        <p className="leading-[32px]">RescueLink</p>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="relative self-stretch shrink-0" data-name="Link">
      <div className="content-stretch flex flex-col items-start pb-[4px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Find Pets</p>
        </div>
      </div>
    </div>
  );
}

function Link6() {
  return (
    <div className="flex-[1_0_0] min-h-px relative" data-name="Link">
      <div className="content-stretch flex flex-col items-start pb-[4px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Services</p>
        </div>
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
    <div className="flex-[1_0_0] min-h-px relative" data-name="Link">
      <div className="content-stretch flex flex-col items-start pb-[4px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Volunteer</p>
        </div>
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
    <div className="flex-[1_0_0] min-h-px relative" data-name="Link">
      <div className="content-stretch flex flex-col items-start pb-[4px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4b5563] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Donate</p>
        </div>
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

function Nav() {
  return (
    <div className="content-stretch flex h-[28px] items-start relative shrink-0" data-name="Nav">
      <Link5 />
      <LinkMargin5 />
      <LinkMargin6 />
      <LinkMargin7 />
    </div>
  );
}

function NavMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[24px] relative shrink-0" data-name="Nav:margin">
      <Nav />
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Container27 />
      <NavMargin />
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex flex-col h-[32px] items-start pb-[9.5px] pt-[6.5px] px-[13px] relative rounded-[6px] shrink-0 w-[192px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Search Placeholder</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#e5e7eb] content-stretch flex flex-col items-center justify-center px-[25px] py-[13px] relative rounded-[2px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-center tracking-[0.7px] whitespace-nowrap">
        <p className="leading-[20px]">Report Emergency</p>
      </div>
    </div>
  );
}

function ButtonMargin2() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[24px] relative shrink-0" data-name="Button:margin">
      <Button4 />
    </div>
  );
}

function Margin29() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start pl-[24px] relative shrink-0 w-[56px]" data-name="Margin">
      <div className="bg-[#f5f5f5] relative rounded-[12px] shrink-0 size-[32px]" data-name="Background+Border">
        <div aria-hidden className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none rounded-[12px]" />
      </div>
    </div>
  );
}

function Margin30() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start pl-[24px] relative shrink-0 w-[56px]" data-name="Margin">
      <div className="bg-[#f5f5f5] relative rounded-[12px] shrink-0 size-[32px]" data-name="Background+Border">
        <div aria-hidden className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none rounded-[12px]" />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <BackgroundBorder1 />
      <ButtonMargin2 />
      <Margin29 />
      <Margin30 />
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[48px] py-[8px] relative size-full">
          <Container26 />
          <Container28 />
        </div>
      </div>
    </div>
  );
}

function HeaderNavigationWireframe() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-start left-0 pb-px right-0 top-0" data-name="Header - Navigation Wireframe">
      <div aria-hidden className="absolute border-[#d1d5db] border-b border-solid inset-0 pointer-events-none" />
      <Container25 />
    </div>
  );
}

export default function SuccessStoriesWireframeDesktop() {
  return (
    <div className="bg-white relative size-full" data-name="Success Stories Wireframe (Desktop)">
      <MainContent />
      <FooterWireframeMargin />
      <HeaderNavigationWireframe />
    </div>
  );
}