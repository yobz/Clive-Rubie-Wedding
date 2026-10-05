const venues = [
  {
    label: "The ceremony",
    schedule: "1:00 PM",
    name: "St. James the Greater Church",
    address: "Talisay City, Negros Occidental",
    photo: "/invitation/church-updated.jpg",
    alt: "St. James the Greater Church illuminated at dusk, viewed from above",
    coordinates: "10.7083620604441,122.99805237570253",
    embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.338382777441!2d122.99805237570253!3d10.7083620604441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33aed3a43637ae3d%3A0xd99f6eb32e1886e2!2sSt.%20James%20the%20Greater%20Church%20(OFM%20Franciscans)!5e0!3m2!1sen!2sph!4v1789037896535!5m2!1sen!2sph",
  },
  {
    label: "The reception",
    schedule: "Cocktails 4:00 PM · Reception 5:00 PM",
    name: "Nato’s Farm",
    address: "Bacolod City, Negros Occidental",
    photo: "/invitation/venue-updated.jpg",
    alt: "Garden courtyard and wooden house at Nato’s Farm",
    coordinates: "10.675662161042977,123.05959167570246",
    embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.7608472180937!2d123.05959167570246!3d10.675662161042977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33aed3237d223f95%3A0x22b2e83c6988c30e!2sNato%27s%20Farm!5e0!3m2!1sen!2sph!4v1789037958648!5m2!1sen!2sph",
  },
];

export function InvitationVenues() {
  return (
    <section id="places" className="section locations venues" aria-labelledby="places-title">
      <div className="container">
        <div className="section-title">
          <h2 id="places-title">The places we’ll celebrate</h2>
          <p className="eyebrow">Two meaningful spaces. One unforgettable day.</p>
        </div>
        {venues.map((venue) => (
          <article className="venue" key={venue.name}>
            <div>
              <h3 className="script">{venue.label}</h3>
              <div className="venue-photo-crop"><img className={`venue-photo ${venue.name === "Nato’s Farm" ? "farm-photo" : "church-photo"}`} src={venue.photo} alt={venue.alt} loading="lazy" decoding="async" width={900} height={600} /></div>
            </div>
            <div className="venue-info">
              <h3>{venue.name}</h3>
              <p>{venue.address}</p><p className="venue-schedule">{venue.schedule}</p>
              <iframe
                className="venue-map"
                title={`Location of ${venue.name}`}
                src={venue.embed}
                width="600"
                height="220"
                style={{ display: "block", width: "100%", maxWidth: "100%", border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <a className="button" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venue.coordinates)}`} target="_blank" rel="noopener noreferrer" aria-label={`Get directions to ${venue.name} (opens in a new tab)`}>
                Get directions <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
