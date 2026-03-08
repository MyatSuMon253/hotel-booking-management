import { updateSearchParams } from "@/lib/helpers";
import { useNavigate, useSearchParams } from "react-router";
import ReactPaginate from "react-paginate";
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideEllipsis,
} from "lucide-react";

type PaginationProps = {
  totalRoomCount: number;
  perPage: number;
};

const Pagination = ({ totalRoomCount, perPage }: PaginationProps) => {
  let [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const handlePageClick = ({ selected }: { selected: number }) => {
    const clickedPage = (selected + 1).toString();

    searchParams = updateSearchParams(searchParams, "page", clickedPage);
    const url = `${window.location.pathname}?${searchParams.toString()}`;
    navigate(url);
  };

  return (
    <main className="pagination">
      <ReactPaginate
        className="mx-auto flex w-full justify-center items-center my-8"
        breakLabel={<LucideEllipsis />}
        nextLabel={<LucideChevronRight className="cursor-pointer" />}
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={Math.ceil(totalRoomCount / perPage)}
        previousLabel={<LucideChevronLeft className="cursor-pointer" />}
        renderOnZeroPageCount={null}
        initialPage={currentPage > 1 ? currentPage - 1 : undefined}
        disabledClassName="text-gray-400"
        pageClassName="border border-gray-400 text-gray-400 px-4 py-2 rounded-md cursor-pointer"
        activeClassName="bg-black text-white border cursor-pointer"
      />
    </main>
  );
};

export default Pagination;
