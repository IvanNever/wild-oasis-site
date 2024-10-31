import Spinner from "@/app/_components/Spinner";

function Loading() {
  return (
    <div className="grid items-center justify-center">
      <p>Cabin data loading...</p>
      <Spinner />;
    </div>
  );
}

export default Loading;
