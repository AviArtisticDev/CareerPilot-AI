import { Link, isRouteErrorResponse, useRouteError } from "react-router";
import "../style/route-error.scss";

const RouteErrorPage = () => {
    const error = useRouteError();

    let title = "Page not found";
    let status = "404";
    let description = "The page you are looking for does not exist, may have moved, or is only available after navigating from a valid flow.";

    if (isRouteErrorResponse(error)) {
        status = String(error.status);
        title = error.status === 404 ? "Page not found" : "Something went wrong";
        description = error.statusText || description;
    } else if (error instanceof Error) {
        title = "Something went wrong";
        status = "Error";
        description = error.message || "An unexpected error occurred while loading this page.";
    }

    return (
        <main className="route-error-page">
            <section className="route-error-card">
                <span className="route-error-badge">{status}</span>
                <h1>{title}</h1>
                <p>{description}</p>

                <div className="route-error-actions">
                    <Link className="button primary-button" to="/">
                        Go To Dashboard
                    </Link>
                    <Link className="route-error-link" to="/login">
                        Back To Login
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default RouteErrorPage;
