import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t py-8 mt-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <h4 className="font-semibold mb-3">FootPulse</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Your ultimate football companion</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Leagues</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/leagues" className="hover:underline">All Leagues</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">More</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/news" className="hover:underline">News</Link></li>
              <li><Link to="/transfers" className="hover:underline">Transfers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Settings</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/settings" className="hover:underline">Preferences</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-xs text-muted-foreground text-center">
          FootPulse — fotmob clone. Not affiliated with any league or club.
        </div>
      </div>
    </footer>
  );
}
