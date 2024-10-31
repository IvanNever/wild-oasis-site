// import { unstable_noStore as noStore } from "next/cache";

import CabinCard from "@/app/_components/CabinCard";
import { getCabins } from "@/app/_lib/data-service";

async function CabinList({ filter }) {
  // noStore();

  const cabins = await getCabins();

  if (!cabins.length) return null;

  const filteredCabins = cabins.filter((cabin) => {
    switch (filter) {
      case "small":
        return cabin.maxCapacity <= 3;
      case "medium":
        return cabin.maxCapacity > 3 && cabin.maxCapacity < 8;
      case "large":
        return cabin.maxCapacity >= 8;
      case "all":
      default:
        return true;
    }
  });

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {filteredCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}

export default CabinList;
