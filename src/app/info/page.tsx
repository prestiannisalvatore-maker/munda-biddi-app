// Content from Munda Biddi Trail Guide PDF

export default function InfoPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Trail Information</h1>
        <p className="text-slate-600 mt-1">
          From the Munda Biddi Trail Guide — Path Through the Forest
        </p>
      </div>

      <section className="prose prose-slate max-w-none">
        <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">
          1. Overview & Trail History
        </h2>
        <p className="text-slate-700 leading-relaxed">
          The Munda Biddi Trail is a world-class, 1,067-kilometer off-road cycling
          and bikepacking adventure stretching from Mundaring in the Perth Hills to
          Albany on the south coast of Western Australia. The name &apos;Munda Biddi&apos;
          translates to &apos;path through the forest&apos; in the Noongar Aboriginal
          language, reflecting the trail&apos;s journey through the traditional lands of
          the Noongar people.
        </p>
        <p className="text-slate-700 leading-relaxed">
          Completed and opened end-to-end in April 2013, the Munda Biddi Trail
          claimed the title of the longest continuous off-road cycling trail of its
          kind in the world. The trail winds through Noongar Boodja (Country),
          offering riders a deep connection to nature, culture, and community.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">
          2. Trail Description & Route
        </h2>
        <p className="text-slate-700 leading-relaxed">
          The trail follows a north-to-south direction from Mundaring (30 minutes
          east of Perth) to Albany. It consists of singletrack, doubletrack, fire
          roads, gravel paths, old rail formations, forest tracks, and occasional
          sealed/unsealed roads. The trail is divided into 108 maintenance sections
          (4–25 km each).
        </p>
        <p className="text-slate-700 leading-relaxed font-medium">
          Regional sections:
        </p>
        <ul className="list-disc pl-6 text-slate-700 space-y-1">
          <li>Darling Range: Red pea-gravel, jarrah forests</li>
          <li>Dwellingup Region: Lane Poole Reserve, Murray River</li>
          <li>Collie to Donnybrook: Farming heartland</li>
          <li>Ferguson Valley: Wine country, rail formations</li>
          <li>Karri Country: Nannup, Pemberton, Northcliffe</li>
          <li>Coastal Section: Walpole, Denmark, Albany</li>
        </ul>

        <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">
          3. Campsites & Accommodation
        </h2>
        <p className="text-slate-700 leading-relaxed">
          The trail features 12 purpose-built campsites strategically placed 40–50
          km apart. Free to use, first-come first-served. Facilities include:
          sleeping shelter (20–25 people), tent sites, composting toilet, rainwater
          tanks, picnic tables, bike storage. No campfires — fuel stoves only.
        </p>
        <p className="text-slate-700 leading-relaxed font-medium">
          The 12 campsites (north to south):
        </p>
        <ol className="list-decimal pl-6 text-slate-700 space-y-1">
          <li>Carinyah</li>
          <li>Wungong</li>
          <li>Dandalup</li>
          <li>Bidjar Ngoulin</li>
          <li>Yarri</li>
          <li>Nglang Boodja</li>
          <li>Nala Mia</li>
          <li>Karta Burnu</li>
          <li>Yirra Kartta</li>
          <li>Kwokralup Beela</li>
          <li>Booner Mundak</li>
          <li>Jinung Beigabup</li>
        </ol>

        <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">
          4. Trail Towns
        </h2>
        <p className="text-slate-700 leading-relaxed">
          Major towns: Mundaring, Jarrahdale, Dwellingup, Collie, Donnybrook,
          Boyanup, Jarrahwood, Nannup, Donnelly River Village, Manjimup, Quinninup,
          Pemberton, Northcliffe, Walpole, Denmark, Albany.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">
          5. Best Time to Ride
        </h2>
        <p className="text-slate-700 leading-relaxed">
          <strong>Autumn (March–May):</strong> Ideal — mild temperatures, dry
          weather. <strong>Spring (Sept–Nov):</strong> Excellent — wildflowers.
          <strong> Winter:</strong> Cooler, wetter. <strong>Summer:</strong> Not
          recommended — very hot, fire danger.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">
          6. Safety & Regulations
        </h2>
        <ul className="list-disc pl-6 text-slate-700 space-y-1">
          <li>No campfires — fuel stoves only</li>
          <li>No wild camping in catchment areas</li>
          <li>Water treatment required for tank water</li>
          <li>Carry PLB, first aid, leave itinerary with someone</li>
          <li>Emergency: 000</li>
        </ul>

        <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">
          Contact & Resources
        </h2>
        <p className="text-slate-700 leading-relaxed">
          Munda Biddi Trail Foundation: (08) 6186 6995 |
          admin@mundabiddi.org.au | mundabiddi.org.au
        </p>
        <p className="text-slate-600 text-sm mt-6 italic">
          Source: Munda Biddi Trail Guide PDF. Check DBCA Park Alerts for current
          conditions.
        </p>
      </section>
    </div>
  );
}
