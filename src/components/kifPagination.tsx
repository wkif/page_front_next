import { cn } from "@/lib/utils";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export default function KifPagination({
    className,
    currentPage,
    total,
    changePage,
    ...props
}: {
    className?: string;
    currentPage: number;
    total: number;
    changePage: (page: number) => void;
}) {
    const totalPages = Math.ceil(total / 10);
    const addPage = () => {
        if (currentPage < totalPages) {
            changePage(currentPage + 1)
        }
    }
    const subPage = () => {
        if (currentPage > 1) {
            changePage(currentPage - 1)
        }
    }
    return (
        total > 10 &&
        <div
            className={cn(
                "flex items-center justify-between",
                className
            )}
            {...props}
        >
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious onClick={() => subPage()} />
                    </PaginationItem>
                    {
                        [...Array(totalPages)].map((_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    isActive={currentPage === index + 1}
                                    onClick={() => changePage(index + 1)}
                                >
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))
                    }
                    <PaginationItem>
                        <PaginationNext onClick={() => addPage()} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}