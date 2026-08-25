"use client";

import { trailInfo, peaks, campsites, exitRoutes, contacts, weatherInfo } from "@/data/stirlingRidgeData";

export default function InfoPage() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Trail Information</h1>
        <p className="text-slate-600">
          Everything you need to know before attempting the Stirling Ridge Walk
        </p>
      </header>

      {/* Critical Warning */}
      <section className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
        <h2 className="font-bold text-xl text-red-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">⚠️</span> Critical Warnings
        </h2>
        <div className="space-y-3 text-red-800">
          <p>
            <strong>This is NOT a marked trail.</strong> It is a different physical challenge to anything else 
            you&apos;ll get in WA and as such you will need to be an experienced hiker of good fitness with 
            proper navigation skills.
          </p>
          <p>
            <strong>No reliable water sources.</strong> Carry 4-5L per day minimum, more if the weather is warm. 
            You will be quite exposed on the ridge.
          </p>
          <p>
            <strong>Alpine conditions possible.</strong> This is the only place in Western Australia that 
            experiences true alpine conditions. Hypothermia is a real risk.
          </p>
          <p>
            <strong>This should NOT be your first or second overnight hike.</strong> At minimum, you should 
            be able to navigate by map and compass and know all exit points along the way.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-xl text-slate-800 mb-4">Overview</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-slate-700 mb-3">Trail Details</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <dt className="text-slate-600">Official Name</dt>
                <dd className="font-medium text-slate-800">{trailInfo.name}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <dt className="text-slate-600">Also Known As</dt>
                <dd className="font-medium text-slate-800 text-right">{trailInfo.alternateNames.join(", ")}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <dt className="text-slate-600">Location</dt>
                <dd className="font-medium text-slate-800">{trailInfo.location}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <dt className="text-slate-600">Traditional Custodians</dt>
                <dd className="font-medium text-slate-800">{trailInfo.traditionalCustodians}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <dt className="text-slate-600">Distance</dt>
                <dd className="font-medium text-slate-800">{trailInfo.distanceKm}km (one way)</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <dt className="text-slate-600">Total Elevation</dt>
                <dd className="font-medium text-slate-800">{trailInfo.elevationGainM}m</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <dt className="text-slate-600">Duration</dt>
                <dd className="font-medium text-slate-800">{trailInfo.duration}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <dt className="text-slate-600">Difficulty</dt>
                <dd className="font-medium text-red-600">Grade {trailInfo.gradeWA} (Expert Only)</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <dt className="text-slate-600">Best Season</dt>
                <dd className="font-medium text-slate-800">{trailInfo.bestTime}</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-slate-600">Park Fees</dt>
                <dd className="font-medium text-slate-800">{trailInfo.cost}</dd>
              </div>
            </dl>
          </div>
          <div>
            <h3 className="font-medium text-slate-700 mb-3">Start & End Points</h3>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="font-medium text-green-800 flex items-center gap-2">
                  <span>🟢</span> Start Point (Recommended)
                </div>
                <p className="text-sm text-green-700 mt-1">{trailInfo.startPoint.name}</p>
                <p className="text-xs text-green-600 mt-1">
                  Lat: {trailInfo.startPoint.lat}, Lng: {trailInfo.startPoint.lng}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="font-medium text-red-800 flex items-center gap-2">
                  <span>🔴</span> End Point
                </div>
                <p className="text-sm text-red-700 mt-1">{trailInfo.endPoint.name}</p>
                <p className="text-xs text-red-600 mt-1">
                  Lat: {trailInfo.endPoint.lat}, Lng: {trailInfo.endPoint.lng}
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="font-medium text-amber-800 flex items-center gap-2">
                  <span>⛰️</span> Highest Point
                </div>
                <p className="text-sm text-amber-700 mt-1">
                  {trailInfo.highestPoint.name} - {trailInfo.highestPoint.elevation}m ASL
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directions */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-xl text-slate-800 mb-4">Getting There</h2>
        <div className="prose prose-sm max-w-none text-slate-700">
          <p className="mb-4">
            Being a one-way hike, you can do it in either direction but unless you are using a shuttle service 
            (the Stirling Range Retreat offer one), you will need to organise a car drop at either end.
          </p>
          
          <h3 className="font-medium text-slate-800 mt-6 mb-2">From Perth</h3>
          <p>
            The Stirling Range is approximately 337km SE of Perth (about 4.5 hours drive). Head south on 
            Albany Highway until you reach Chester Pass Road.
          </p>

          <h3 className="font-medium text-slate-800 mt-6 mb-2">From Albany</h3>
          <p>
            The park is approximately 95km north of Albany (about 1 hour drive). Head north along Albany 
            Highway until you reach the roundabout, then take Chester Pass Road north.
          </p>

          <h3 className="font-medium text-slate-800 mt-6 mb-2">To Bluff Knoll Trailhead (End Point)</h3>
          <p>
            Large car park at the base of Bluff Knoll, easily accessible from Chester Pass Road via 
            Bluff Knoll Road.
          </p>

          <h3 className="font-medium text-slate-800 mt-6 mb-2">To Gnowellen Road Trailhead (Start Point)</h3>
          <p>
            From Bluff Knoll Road, turn right onto Chester Pass Road until you reach the turn for Smith Road. 
            Turn right and follow all the way to Sandalwood Road, turn right again and keep following until 
            you see the sign for Gnowellen Road. Turn right and keep driving until you reach the Stirling Range 
            National Park sign. There is plenty of room to park here or you can turn right onto the vehicle 
            track and keep driving until you reach the gate and Leave No Trace sign for the walk.
          </p>
        </div>
      </section>

      {/* Peaks */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-xl text-slate-800 mb-4">Peaks Along the Ridge</h2>
        <p className="text-sm text-slate-600 mb-4">
          Listed from west (Bluff Knoll) to east (Ellen Peak) - opposite direction to recommended hiking route.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {peaks.map((peak) => (
            <div key={peak.id} className="p-4 bg-slate-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-slate-800">{peak.name}</h3>
                <span className="text-sm font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  {peak.elevation}m
                </span>
              </div>
              <p className="text-sm text-slate-600">{peak.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Camping */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-xl text-slate-800 mb-4">Camping Spots</h2>
        <p className="text-sm text-slate-600 mb-4">
          These are informal camping locations along the ridge. There are no facilities - pack out all waste 
          and bury human waste at least 15cm deep.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {campsites.map((site) => (
            <div key={site.id} className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-medium text-slate-800 mb-2">{site.name}</h3>
              <p className="text-sm text-slate-600 mb-3">{site.description}</p>
              <div className="flex flex-wrap gap-1">
                {site.features.map((feature, i) => (
                  <span key={i} className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Exit Routes */}
      <section className="bg-amber-50 rounded-xl border border-amber-200 p-6">
        <h2 className="font-semibold text-xl text-amber-800 mb-4">Emergency Exit Routes</h2>
        <p className="text-sm text-amber-700 mb-4">
          Know these exit points BEFORE you start. Weather can change rapidly and you may need to abort.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {exitRoutes.map((route, i) => (
            <div key={i} className="p-4 bg-white rounded-lg border border-amber-200">
              <h3 className="font-medium text-amber-800 mb-2">{route.name}</h3>
              <p className="text-sm text-amber-700 mb-2">{route.description}</p>
              <div className="text-xs text-amber-600">
                <strong>Accessible from:</strong> {route.accessFrom.join(", ")}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Weather */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-xl text-slate-800 mb-4">Weather Conditions</h2>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
          <p className="text-blue-800">{weatherInfo.conditions}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-slate-700 mb-2">Weather Risks</h3>
            <ul className="space-y-2">
              {weatherInfo.risks.map((risk, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-red-500 mt-0.5">⚠️</span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-slate-700 mb-2">Recommendations</h3>
            <ul className="space-y-2">
              {weatherInfo.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-green-500 mt-0.5">✓</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-xl text-slate-800 mb-4">Important Contacts</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-medium text-red-800">Emergency</h3>
            <p className="text-2xl font-bold text-red-600">{contacts.emergency}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium text-slate-800">{contacts.stirlingRangeNP.name}</h3>
            <p className="text-lg font-semibold text-slate-700">{contacts.stirlingRangeNP.phone}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium text-slate-800">{contacts.albanyDistrict.name}</h3>
            <p className="text-lg font-semibold text-slate-700">{contacts.albanyDistrict.phone}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium text-slate-800">{contacts.stirlingRangeRetreat.name}</h3>
            <p className="text-sm text-slate-600">{contacts.stirlingRangeRetreat.description}</p>
          </div>
        </div>
      </section>

      {/* Pre-Hike Checklist */}
      <section className="bg-green-50 rounded-xl border border-green-200 p-6">
        <h2 className="font-semibold text-xl text-green-800 mb-4">Before You Go Checklist</h2>
        <ul className="space-y-2">
          {[
            "Check Bureau of Meteorology forecast for Stirling Range",
            "Sign the walkers register at Bluff Knoll Road entrance",
            "Ensure you have offline maps/GPS and know how to use them",
            "Carry a Personal Locator Beacon (PLB)",
            "Pack 4-5L water per day",
            "Know ALL exit routes",
            "Inform someone of your plans and expected return time",
            "Check the Stirling Ridge Walk Facebook group for recent updates",
            "Organise car shuttle between trailheads",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-green-800">
              <span className="mt-0.5">☐</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Resources */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-xl text-slate-800 mb-4">Useful Resources</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="https://www.thelifeofpy.com/stirling-ridge-walk"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <h3 className="font-medium text-amber-700">The Life of Py - Detailed Trip Report</h3>
            <p className="text-sm text-slate-600">Comprehensive guide with photos and day-by-day account</p>
          </a>
          <a
            href="https://www.facebook.com/groups/stirlingridgewalk/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <h3 className="font-medium text-amber-700">Stirling Ridge Walk Facebook Group</h3>
            <p className="text-sm text-slate-600">Community group with GPS files and current conditions</p>
          </a>
          <a
            href="https://trailswa.com.au/trails/trail-networks/stirling-range-national-park"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <h3 className="font-medium text-amber-700">Trails WA - Official Information</h3>
            <p className="text-sm text-slate-600">Official trail network information from Trails WA</p>
          </a>
          <a
            href="https://parks.dpaw.wa.gov.au/park/stirling-range"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <h3 className="font-medium text-amber-700">Parks WA - Stirling Range</h3>
            <p className="text-sm text-slate-600">Official park information and alerts</p>
          </a>
        </div>
      </section>
    </div>
  );
}
