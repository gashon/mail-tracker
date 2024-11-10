import type { LanguageModelFilterOptions } from "@/types";
import { logger } from "@/lib/logger";

class BaseFilter {
  protected removedCount: number = 0;
  constructor() {}

  public getRemovedCount(): number {
    return this.removedCount;
  }

  protected getActivities() {
    return document.querySelectorAll<HTMLElement>(
      'div[data-id^="urn:li:activity"]'
    );
  }
}

export class PromotedActivitiesFilterSingleton extends BaseFilter {
  private readonly promotionTags: string[] = [
    '.update-components-actor__sub-description-link span[aria-hidden="true"]',
    '.update-components-actor__description span[aria-hidden="true"]',
  ];
  private readonly PROMOTED_TEXT = "Promoted";
  private debouncedRemovePromotedActivities: (...args: any[]) => void;

  constructor() {
    super();
    this.removePromotedActivities = this.removePromotedActivities.bind(this);
    // Create the debounced function once in the constructor
    this.debouncedRemovePromotedActivities = this.debounce(
      this.removePromotedActivities,
      250
    );
  }

  public init(): void {
    if (!this.promotionTags) {
      logger.error("PromotionTags not initialized properly");
      return;
    }

    this.removePromotedActivities();

    window.addEventListener("scroll", this.debouncedRemovePromotedActivities);
    logger.log(
      "Scroll listener for removing promoted activities has been added."
    );
  }

  public cleanup(): void {
    window.removeEventListener(
      "scroll",
      this.debouncedRemovePromotedActivities
    );
  }

  public removePromotedActivities(): void {
    try {
      const activities = this.getActivities();
      activities.forEach((activity) => {
        if (!activity) return;

        for (const tag of this.promotionTags) {
          const promotedTag = activity.querySelector<HTMLElement>(tag);
          if (promotedTag?.textContent?.trim() === this.PROMOTED_TEXT) {
            activity.remove();
            this.removedCount++;
            break;
          }
        }
      });

      if (this.removedCount > 0) {
        logger.log(
          `Removed total ${this.removedCount} promoted activity elements.`
        );
      }
    } catch (error) {
      logger.error(`Error in removePromotedActivities: ${error}`);
    }
  }

  private debounce(func: Function, wait: number) {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return (...args: any[]) => {
      const context = this; // Preserve the class context

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }
}

export class LanguageModelFilterSingleton extends BaseFilter {
  private filterOptions: LanguageModelFilterOptions;

  constructor(filterOptions: LanguageModelFilterOptions) {
    super();
    this.filterOptions = filterOptions;
  }

  public setFilterOptions(filterOptions: LanguageModelFilterOptions): void {
    this.filterOptions = filterOptions;
  }

  private async filterElement(text: string): Promise<boolean> {
    // TODO implement
    return false;
  }

  private async filterPosts(): Promise<void> {
    const activities = this.getActivities();

    // TODO(gashon) properly extract text from html
    const activitiesInnerText: string[] = [];

    activities.forEach((activity) => {
      // TODO(gashon) properly get the inner text
      activitiesInnerText.push(activity.innerText);
    });

    const jobs = activitiesInnerText.map((innerText) =>
      this.filterElement(innerText)
    );

    const results = await Promise.all(jobs);
    for (let i = 0; i < results.length; i++) {
      if (results[i]) {
        activities[i].remove();
        this.removedCount++;
      }
    }
  }
}
