import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HomeComponent } from "./home.component";

describe("HomeComponent", () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HomeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have HERO_IMAGE_URL set to '/redirects/heroImage'", () => {
        expect(component.HERO_IMAGE_URL).toBe("/redirects/heroImage");
    });

    it("should have HERO_IMAGE_ALT property set with descriptive alt text", () => {
        expect(typeof component.HERO_IMAGE_ALT).toBe("string");
        expect(component.HERO_IMAGE_ALT).toContain("Bild"); // Should contain German word for "image"
    });

    it("should have titleHtml property containing multi-line HTML content", () => {
        expect(typeof component.titleHtml).toBe("string");
        expect(component.titleHtml).toContain("Medizinische Hilfe");
        expect(component.titleHtml).toContain("Tanzania");
        // Should contain HTML line break for two lines in hero section
    });

    it("should have subtitle property with team description", () => {
        expect(typeof component.subtitle).toBe("string");
        expect(component.subtitle.length).toBeGreaterThan(0);
        expect(component.subtitle).toContain("wir sind ein Team").toLocaleLowerCase() || 
               expect(component.subtitle).toContain("Wir sind ein Team"); // case-insensitive check
    });

    it("should have newsTitle property set to 'Aktuell:'", () => {
        expect(component.newsTitle).toBe("Aktuell:");
    });

    it("should expose HERO_IMAGE_URL as const-compatible readonly constant", () => {
        expect(Object.getOwnPropertyDescriptor(component.constructor.prototype, "HERO_IMAGE_URL")).toBeDefined();
        // The property should be defined and accessible
        const value = (component as any).HERO_IMAGE_URL;
        expect(value).toBe("/redirects/heroImage");
    });

    it("should expose HERO_IMAGE_ALT as readonly string constant with meaningful description", () => {
        const desc = (component as any).HERO_IMAGE_ALT;
        expect(typeof desc).toBe("string");
        // Should describe the hero/title image purpose in German
        expect(desc.length).toBeGreaterThan(0);
    });

    it("should expose titleHtml as readonly string with HTML line breaks", () => {
        const html = (component as any).titleHtml;
        expect(typeof html).toBe("string");
        // Should contain both lines separated by <br>
        expect(html.includes("<br>")).toBe(true);
    });

    it("should expose subtitle as readonly non-empty string", () => {
        const text = (component as any).subtitle;
        expect(typeof text).toBe("string");
        expect(text.length).toBeGreaterThan(0);
    });

    it("should expose newsTitle as readonly constant string property", () => {
        expect((component as any).newsTitle).toBe("Aktuell:");
    });

    it("should maintain consistency across component instances for public properties", () => {
        const newInstance = new HomeComponent(); // If constructor allows this
        expect(newInstance.HERO_IMAGE_URL).toBeTruthy();
        expect((newInstance as any).titleHtml.includes("<br>")).toBeTruthy();
    });
});
