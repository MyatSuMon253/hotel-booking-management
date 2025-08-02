import { Loader2 } from "lucide-react";

function Loader() {
  return (
    <div className="fixed w-full h-[100vh] top-0 left-0 z-20 flex items-center justify-center">
      <Loader2 className="animate-spin w-14 h-14" />
    </div>
  );
}

export default Loader;