import { GET_BOOKING_BY_ID } from "@/graphql/queries/booking";
import { useQuery } from "@apollo/client";
import { Printer, Calendar, Bed } from "lucide-react";
import { useParams } from "react-router";
import Loader from "../common/Loader";
import NotFound from "../common/NotFound";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

const InvoiceApp = () => {
  const params = useParams();

  const { data, loading, error } = useQuery(GET_BOOKING_BY_ID, {
    variables: { bookingId: params?.id },
  });

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <NotFound />;
  }

  const booking = data.getBookingById;

  const unformat_startDate = new Date(Number(booking.startDate));
  const startDate = unformat_startDate.toLocaleDateString("en-GB");

  const unformat_endDate = new Date(Number(booking.endDate));
  const endDate = unformat_endDate.toLocaleDateString("en-GB");

  // Mock data for Bagan Hotel Booking
  const invoiceData = {
    number: booking.id,
    sender: {
      name: "Rangoon Heritage Hotel",
    },
    client: {
      name: booking.customer.name,
      email: booking.customer.email,
    },
    booking: {
      checkIn: startDate,
      checkOut: endDate,
      nights: booking.daysOfRent,
      roomType: booking.room.title,
    },
    financials: {
      ratePerNight: booking.room.pricePerNight,
      subtotal: booking.amount.rent,
      taxRate: 5, // 5% Gov Tax
      taxAmount: booking.amount.tax,
      total: booking.amount.total,
      currency: "$",
    },
    notes:
      "Check-in time is 14:00. Check-out time is 12:00. Breakfast is included at the River Terrace.",
  };

  const handlePrint = () => {
    const input = document.getElementById("print-container");
    if (!input) return;

    // Add a temp class for cleaner export
    input.classList.add("exporting");

    html2canvas(input, {
      backgroundColor: "#ffffff", // force white
      scale: 2, // sharper PDF
    }).then((canvas) => {
      input.classList.remove("exporting");

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`rangoon-heritage-invoice-${booking.id}.pdf`);
    });
  };

  return (
    <div className="min-h-screen bg-white py-10 font-sans print:bg-white print:py-0 print:m-0">
      {/* Print CSS Configuration */}
      <style>{`
  @media print {
    @page {
      margin: 0;
      size: auto;
    }

    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      background: white !important;
    }

    .no-print {
      display: none !important;
    }

    #print-container {
      box-shadow: none !important;
      border: none !important;
      margin: 0 !important;
      width: 100% !important;
    }
  }
`}</style>
      {/* Control Bar */}
      <div className="no-print max-w-3xl mx-auto mb-6 flex justify-end">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-amber-900 hover:bg-amber-950 text-white px-5 py-2 rounded shadow-sm transition-colors"
        >
          <Printer size={18} />
          <span>Download</span>
        </button>
      </div>

      {/* Invoice Paper */}
      <div
        className="  max-w-3xl mx-auto
      bg-white shadow-lg rounded-sm overflow-hidden border border-gray-200 p-12
      print:shadow-none print:border-none print:p-10 print:max-w-full print:rounded-none"
        id="print-container"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-3xl font-serif font-bold text-amber-900 mb-2">
              {invoiceData.sender.name}
            </h1>
            <div className="text-slate-600">
              <div className="flex justify-end gap-4 mb-1">
                <span className="font-semibold text-slate-800">Ref #:</span>
                <span>{invoiceData.number}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-light text-slate-200 uppercase tracking-widest mb-4">
              Invoice
            </h2>
          </div>
        </div>

        <hr className="border-gray-100 mb-8" />

        {/* Guest Info */}
        <div className="mb-10">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Guest Details
          </h3>
          <p className="text-xl font-semibold text-slate-900 mb-1">
            {invoiceData.client.name}
          </p>
          <div className="text-slate-500">
            <p>{invoiceData.client.email}</p>
          </div>
        </div>

        {/* Booking Details Grid */}
        <div className="mb-10 bg-amber-50 rounded-lg p-6 border border-amber-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 text-amber-800 font-semibold mb-1 text-sm uppercase tracking-wide">
                <Calendar size={14} /> Check In
              </div>
              <p className="text-lg text-slate-800">
                {invoiceData.booking.checkIn}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-amber-800 font-semibold mb-1 text-sm uppercase tracking-wide">
                <Calendar size={14} /> Check Out
              </div>
              <p className="text-lg text-slate-800">
                {invoiceData.booking.checkOut}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-amber-800 font-semibold mb-1 text-sm uppercase tracking-wide">
                <Bed size={14} /> Room Type
              </div>
              <p className="text-slate-800">{invoiceData.booking.roomType}</p>
            </div>
          </div>
        </div>

        {/* Simple Summary / Totals */}
        <div className="flex justify-end mb-12">
          <div className="w-1/2">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-slate-600">
                Room Rate ({invoiceData.booking.nights} nights x{" "}
                {invoiceData.financials.currency}
                {invoiceData.financials.ratePerNight})
              </span>
              <span className="font-medium text-slate-700">
                {invoiceData.financials.currency}
                {invoiceData.financials.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-slate-500">Service Charge</span>
              <span className="font-medium text-slate-700">
                {invoiceData.financials.currency}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-slate-500">
                Tax ({invoiceData.financials.taxRate}%)
              </span>
              <span className="font-medium text-slate-700">
                {invoiceData.financials.currency}
                {invoiceData.financials.taxAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-4">
              <span className="text-xl font-bold text-slate-900">
                Total Due
              </span>
              <span className="text-xl font-bold text-amber-800">
                {invoiceData.financials.currency}
                {invoiceData.financials.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 rounded p-6">
          <h4 className="text-sm font-bold text-slate-800 mb-2">
            Hotel Policy
          </h4>
          <p className="text-sm text-slate-500 leading-relaxed">
            {invoiceData.notes}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceApp;
