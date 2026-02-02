import jsPDF from "jspdf";
import logo from "../assets/learnsphere-logo.png";
import GreatVibesBase64 from "../fonts/GreatVibesBase64";
import signature from "../assets/signature.png";
import bgTexture from "../assets/certificate-bg.jpg";

export const generateCertificate = ({studentName, courseName, teacherName, percentage, certificateId, date}) => {
  const doc = new jsPDF("landscape", "mm", "a4");

  doc.addFileToVFS("GreatVibes.ttf", GreatVibesBase64);
  doc.addFont("GreatVibes.ttf", "GreatVibes", "normal");

  // const studentName = "Sandipan Seth";
  // const courseName = "Advanced React Development";
  // const teacherName = "Prof Dedeep Guha";
  // const percentage = "92%";
  // const certificateId = `LS-${Date.now()}`;
  // const formatDateWithSuffix = (date) => {
  //   const day = date.getDate();

  //   const suffix =
  //     day % 10 === 1 && day !== 11
  //       ? "st"
  //       : day % 10 === 2 && day !== 12
  //         ? "nd"
  //         : day % 10 === 3 && day !== 13
  //           ? "rd"
  //           : "th";

  //   const month = date.toLocaleString("en-US", { month: "long" });
  //   const year = date.getFullYear();

  //   return `${day}${suffix} ${month}, ${year}`;
  // };

 const safeDate = date ? new Date(date) : new Date();

 const addOrdinal = (day) => {
   if (day > 3 && day < 21) return "th";
   switch (day % 10) {
     case 1:
       return "st";
     case 2:
       return "nd";
     case 3:
       return "rd";
     default:
       return "th";
   }
 };

 const day = safeDate.getDate();

 const issueDate = `${day}${addOrdinal(day)} ${safeDate.toLocaleDateString(
   "en-GB",
   { month: "long", year: "numeric" },
 )}`;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ===== BACKGROUND TEXTURE =====
  doc.addImage(bgTexture, "PNG", 0, 0, pageWidth, pageHeight);

  /* ================= WATERMARK ================= */
  doc.setFontSize(60);
  doc.setTextColor(230, 230, 230);
  doc.text("LEARN SPHERE", pageWidth / 2 + 10, pageHeight / 2 + 35, {
    align: "center",
    angle: 30,
  });
  doc.setTextColor(0, 0, 0);

  /* ================= BORDER ================= */
  // doc.setLineWidth(1.5);
  // doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  /* ================= LOGO ================= */
  doc.addImage(logo, "PNG", pageWidth / 2 - 30, 22, 60, 40);

  /* ================= TITLE ================= */
  doc.setFont("times", "bold");
  doc.setFontSize(30);
  doc.text("Certificate of Completion", pageWidth / 2, 70, {
    align: "center",
  });

  /* ================= CONTENT ================= */
  doc.setFont("times", "normal");
  doc.setFontSize(14);
  doc.text("This certificate is proudly awarded to", pageWidth / 2, 86, {
    align: "center",
  });

  // Student Name (Cursive)
  doc.setFont("GreatVibes", "normal");
  doc.setFontSize(36);
  doc.text(studentName, pageWidth / 2, 105, { align: "center" });

  doc.setFont("times", "normal");
  doc.setFontSize(14);
  doc.text(
    "for demonstrating dedication and excellence by successfully completing",
    pageWidth / 2,
    116,
    { align: "center" },
  );

  doc.setFont("times", "bold");
  doc.setFontSize(20);
  doc.text(courseName, pageWidth / 2, 126, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text(
    `with an overall achievement score of ${percentage} on ${issueDate}.`,
    pageWidth / 2,
    136,
    { align: "center" },
  );

  doc.setFont("times", "normal");
  doc.text(
    "This accomplishment reflects a strong commitment to learning and professional growth.",
    pageWidth / 2,
    146,
    { align: "center" },
  );

  /* ================= FOOTER LEFT ================= */
  const leftX = 23;
  const footerY = pageHeight - 50;

  doc.setFontSize(13);
  doc.text(`Instructor:  ${teacherName}`, leftX, footerY);

  doc.line(leftX, footerY + 6, leftX + 60, footerY + 6);
  doc.addImage(
    signature,
    "PNG",
    leftX, // slight right offset
    footerY + 15, // below the line
    40, // width
    12, // height
    20,
  );
  doc.setFontSize(11);
  doc.text("Authorized Signature", leftX, footerY + 14);

  /* ================= GOLD BADGE (BOTTOM RIGHT) ================= */
  const badgeX = pageWidth - 35;
  const badgeY = pageHeight - 40;

  doc.setFillColor(212, 175, 55);
  doc.circle(badgeX, badgeY, 14, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("times", "bold");
  doc.text("CERTIFIED", badgeX, badgeY + 3, { align: "center" });

  doc.setTextColor(0, 0, 0);

  // Certificate ID below badge
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text(`Certificate ID: ${certificateId}`, badgeX - 10, badgeY + 20, {
    align: "center",
  });

  /* ================= BRAND ================= */
  // doc.setFontSize(12);
  // doc.text("LearnSphere", pageWidth - 60, pageHeight - 0);

  /* ================= SAVE ================= */
  doc.save(`${studentName}_LearnSphere_Certificate.pdf`);
};
