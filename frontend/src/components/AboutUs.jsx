export const AboutUs = () => {
  return (
    <section className="AboutUs" id="about" style={{ display: "block", clear: "both", width: "100%", height: "600vh", position: "relative", zIndex: 10, background: '#0f172a' }}>
      <div style={{ position: 'sticky', top: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
        <iframe
          src="/Read.html"
          style={{ width: "100%", height: "100%", border: "none", display: "block", pointerEvents: "none" }}
          title="About Us Page"
          loading="lazy"
        />
      </div>
    </section>
  )
}