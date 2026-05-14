import Link from "next/link";
import { T } from "@/components/lang";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <div className="crumbs">
            <Link href="/">
              <T en="Home" vi="Trang chủ" />
            </Link>
            {" · "}
            <span>
              <T en="About" vi="Giới thiệu" />
            </span>
          </div>
          <h1 className="serif">
            <T en="A founder's story," vi="Câu chuyện người sáng lập," />
            <br />
            <span className="accent">
              <T en="and a love letter to tradition." vi="lá thư tình gửi truyền thống." />
            </span>
          </h1>
          <p className="subtitle">
            <T
              en="By Juliane Cao — makeup artist, IT veteran, and the woman who started Mississauga Wedding Solutions."
              vi="Bởi Juliane Cao — chuyên gia trang điểm, kỳ cựu trong ngành CNTT, và người sáng lập Mississauga Wedding Solutions."
            />
          </p>
        </div>
      </section>

      <section>
        <div className="shell">
          <div className="story">
            <div className="portrait ph warm">
              <span>Juliane Cao — studio portrait</span>
            </div>
            <div className="story-body">
              <span className="eyebrow">
                <span className="dash" />
                <T en="The why" vi="Vì sao" />
              </span>
              <h2
                className="serif"
                style={{ margin: "14px 0 28px", fontSize: "clamp(32px, 4vw, 48px)" }}
              >
                <T
                  en="A wedding is the one day a family becomes"
                  vi="Đám cưới là ngày một gia đình"
                />{" "}
                <span className="italic" style={{ color: "var(--red)" }}>
                  <T en="visible to itself." vi="nhìn thấy chính mình." />
                </span>
              </h2>

              <p className="lead-p">
                <T
                  en="When I do makeup for Vietnamese brides, I rarely see a traditional Vietnamese wedding — especially when the groom isn't Vietnamese. Other cultures keep their traditions regardless of background. I wanted to know why we weren't keeping ours."
                  vi="Khi Hảo trang điểm cho cô dâu Việt, ít khi thấy đám cưới Việt truyền thống — nhất là khi chú rể không phải người Việt. Các văn hóa khác giữ truyền thống bất kể nguồn gốc. Hảo muốn biết vì sao chúng ta lại không."
                />
              </p>

              <p>
                <T
                  en="The feedback from young Vietnamese-Canadians was honest: they didn't understand the meaning. The rituals felt like a checklist their parents handed them, with no one to explain why. So I started helping. One bride at a time."
                  vi="Câu trả lời từ thế hệ trẻ Việt-Canada rất thật: các em không hiểu ý nghĩa. Nghi lễ giống danh sách cha mẹ trao cho, không ai giải thích vì sao. Nên Hảo bắt đầu giúp. Từng cô dâu một."
                />
              </p>

              <p>
                <T
                  en="Today, Mississauga Wedding Solutions is a one-stop home for traditional Vietnamese weddings: hair, makeup, flowers, áo dài rentals, the wine tray, the bilingual MC, the photographer, the hotel block. Everything you need, in one phone call."
                  vi="Hôm nay, Mississauga Wedding Solutions là nơi trọn gói cho đám cưới Việt cổ truyền: tóc, trang điểm, hoa, cho thuê áo dài, mâm rượu, MC song ngữ, nhiếp ảnh, đặt khách sạn. Tất cả, trong một cuộc gọi."
                />
              </p>

              <div className="vi-block">
                Mỗi khi Hảo làm trang điểm cho cô dâu Việt, Hảo nhận thức rất ít có những đám cưới
                Việt theo phong tục cổ truyền thuần túy, nhất là nếu chú rể không phải là người
                Việt. Thế hệ trẻ chưa hiểu rõ những truyền thống đó vì các em sinh ra và lớn lên ở
                đây. Vì thế Hảo mở dịch vụ này — để giúp các em thấy được vẻ đẹp và ý nghĩa của
                đám cưới Việt.
              </div>

              <p>
                <T
                  en="I've been an IT professional for over thirty years, managing contracts with software, hardware, and staffing vendors. Alongside that, I love wearing makeup myself, so I went and earned my certification as a Professional Makeup Artist. I'm also the Unfranchise Owner of an online retailer at thecaowebstore.com — entrepreneurship runs in my blood."
                  vi="Hảo làm CNTT trên 30 năm, quản lý hợp đồng với nhà cung cấp phần mềm, phần cứng, nhân lực. Song song, Hảo thích trang điểm và đã đi học lấy bằng chuyên nghiệp. Hảo còn làm đại lý cho shop.com với trang mạng thecaowebstore.com — máu kinh doanh có sẵn trong người."
                />
              </p>

              <p>
                <T
                  en="I want to be the company where East meets West — where a young Vietnamese-Canadian bride and her non-Vietnamese groom can have a wedding that feels true to both of them, with someone who knows the rituals well enough to translate the meaning, not just the words."
                  vi="Hảo muốn là công ty nơi Á Đông gặp phương Tây — nơi cô dâu Việt-Canada và chú rể nước ngoài có một đám cưới đúng với cả hai, với người hiểu nghi lễ đủ sâu để dịch ý nghĩa, không chỉ dịch lời."
                />
              </p>

              <p className="signature">~ Juliane</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--bg-warm)" }}>
        <div className="shell">
          <div className="section-head">
            <span className="eyebrow eyebrow-gold">
              <span className="dash" />
              <T en="What we believe" vi="Niềm tin của chúng tôi" />
            </span>
            <h2 className="serif">
              <T en="Three things we" vi="Ba điều chúng tôi" />{" "}
              <span className="italic" style={{ color: "var(--red)" }}>
                <T en="never compromise on." vi="không bao giờ thỏa hiệp." />
              </span>
            </h2>
          </div>
          <div className="values">
            <div className="value">
              <span className="num">i</span>
              <h3 className="serif">
                <T en="Meaning before spectacle" vi="Ý nghĩa trước hình thức" />
              </h3>
              <span className="vi">Ý nghĩa trên hết</span>
              <p>
                <T
                  en="Every ritual gets explained — to the bride, to the groom, to the in-laws who flew in last night. Spectacle is easy. Meaning is harder, and worth it."
                  vi="Mỗi nghi lễ đều được giải thích — cho cô dâu, chú rể, và họ hàng xa. Hình thức dễ. Ý nghĩa khó hơn, và xứng đáng."
                />
              </p>
            </div>
            <div className="value">
              <span className="num">ii</span>
              <h3 className="serif">
                <T en="Both sides, equally" vi="Cả hai bên, ngang nhau" />
              </h3>
              <span className="vi">Cả hai bên đều quan trọng</span>
              <p>
                <T
                  en="A bilingual wedding is not a Vietnamese wedding with English subtitles. We design every cue so both families feel like the day was made for them."
                  vi="Đám cưới song ngữ không phải đám cưới Việt có phụ đề Anh. Chúng tôi thiết kế từng điểm để cả hai gia đình cảm thấy ngày đó dành cho mình."
                />
              </p>
            </div>
            <div className="value">
              <span className="num">iii</span>
              <h3 className="serif">
                <T en="One phone call" vi="Một cuộc gọi" />
              </h3>
              <span className="vi">Một cuộc gọi cho mọi việc</span>
              <p>
                <T
                  en="Planning a wedding shouldn't be a second job. We're the single number you call — for the áo dài, the flowers, the photographer, and the family who can't find the venue."
                  vi="Lo đám cưới không nên là công việc thứ hai. Chúng tôi là số duy nhất bạn cần gọi — cho áo dài, hoa, nhiếp ảnh, và cả họ hàng không tìm được nhà hàng."
                />
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="shell">
          <div className="cta-banner">
            <div>
              <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>
                <span className="dash" />
                <T en="Tea & talk" vi="Trò chuyện" />
              </span>
              <h2 className="serif" style={{ marginTop: 14 }}>
                <T en="Come meet us." vi="Hãy đến gặp chúng tôi." />
              </h2>
              <p>
                <T
                  en="Sixty minutes, in our studio. We'll pour tea. You'll tell us what you're imagining. We'll tell you what's possible."
                  vi="Sáu mươi phút, tại studio. Chúng tôi sẽ pha trà. Bạn kể giấc mơ. Chúng tôi sẽ nói khả năng thực hiện."
                />
              </p>
            </div>
            <div className="actions">
              <Link href="/contact" className="btn btn-gold">
                <T en="Book a consultation" vi="Đặt buổi tư vấn" />
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
