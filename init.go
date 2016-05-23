package foodtrucks

import (
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"html"
	"net/http"
)

func init() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		ctx := appengine.NewContext(r)
		path := html.EscapeString(r.URL.Path)
		log.Warningf(ctx, "Go was called, path: %v", path)
		http.Error(w, "Move along, nothing to see", http.StatusNotFound)
	})
}
