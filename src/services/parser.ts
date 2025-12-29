import {
  ParsedData,
  SlangEntry,
  FoodEntry,
  TrafficRoute,
  CultureEntry,
  TimeOfDay,
  ValidationResult
} from '../models/types';

export class KnowledgeBaseParser {
  /**
   * Parse the product.md file content and extract structured data
   */
  parseFile(content: string): ParsedData {
    const data: ParsedData = {
      slang: [],
      food: [],
      traffic: [],
      culture: []
    };

    try {
      // Split content into sections by ## headers
      const sections = this.splitIntoSections(content);

      // Parse each section based on its title
      for (const section of sections) {
        const title = section.title.toLowerCase();

        if (title.includes('slang')) {
          data.slang = this.parseSlangSection(section.content);
        } else if (title.includes('food')) {
          data.food = this.parseFoodSection(section.content);
        } else if (title.includes('traffic')) {
          data.traffic = this.parseTrafficSection(section.content);
        } else if (title.includes('culture')) {
          data.culture = this.parseCultureSection(section.content);
        }
      }
    } catch (error) {
      console.error('Error parsing knowledge base:', error);
    }

    return data;
  }

  /**
   * Split markdown content into sections by ## headers
   */
  private splitIntoSections(content: string): Array<{ title: string; content: string }> {
    const sections: Array<{ title: string; content: string }> = [];
    const lines = content.split('\n');
    let currentSection: { title: string; content: string } | null = null;

    for (const line of lines) {
      // Check for ## header (section start)
      if (line.startsWith('## ')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: line.replace('## ', '').trim(),
          content: ''
        };
      } else if (currentSection) {
        currentSection.content += line + '\n';
      }
    }

    // Add the last section
    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  }

  /**
   * Parse slang entries from section content
   */
  private parseSlangSection(content: string): SlangEntry[] {
    const entries: SlangEntry[] = [];
    const items = this.splitByH3Headers(content);

    for (const item of items) {
      try {
        const entry: Partial<SlangEntry> = {
          term: item.title
        };

        // Parse bullet points
        const lines = item.content.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          
          if (trimmed.startsWith('- **Category**:')) {
            const category = trimmed.replace('- **Category**:', '').trim().toLowerCase();
            entry.category = category as "kannada" | "tech" | "general";
          } else if (trimmed.startsWith('- **Meaning**:')) {
            entry.meaning = trimmed.replace('- **Meaning**:', '').trim();
          } else if (trimmed.startsWith('- **Usage**:')) {
            entry.usage = trimmed.replace('- **Usage**:', '').trim();
          } else if (trimmed.startsWith('- **Example**:')) {
            entry.examples = [trimmed.replace('- **Example**:', '').trim()];
          }
        }

        // Validate required fields
        if (entry.term && entry.meaning && entry.usage && entry.category) {
          entries.push(entry as SlangEntry);
        }
      } catch (error) {
        console.warn('Failed to parse slang entry:', item.title, error);
      }
    }

    return entries;
  }

  /**
   * Parse food entries from section content
   */
  private parseFoodSection(content: string): FoodEntry[] {
    const entries: FoodEntry[] = [];
    const items = this.splitByH3Headers(content);

    for (const item of items) {
      try {
        const entry: Partial<FoodEntry> = {
          name: item.title,
          spots: [],
          bestTimes: []
        };

        // Parse bullet points
        const lines = item.content.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          
          if (trimmed.startsWith('- **Description**:')) {
            entry.description = trimmed.replace('- **Description**:', '').trim();
          } else if (trimmed.startsWith('- **Spots**:')) {
            const spotsText = trimmed.replace('- **Spots**:', '').trim();
            entry.spots = spotsText.split(',').map(s => s.trim());
          } else if (trimmed.startsWith('- **Price Range**:')) {
            entry.priceRange = trimmed.replace('- **Price Range**:', '').trim();
          } else if (trimmed.startsWith('- **Best Times**:')) {
            const timesText = trimmed.replace('- **Best Times**:', '').trim();
            const times = timesText.split(',').map(t => t.trim().toLowerCase());
            entry.bestTimes = times.map(t => {
              if (t.includes('morning')) return TimeOfDay.Morning;
              if (t.includes('afternoon')) return TimeOfDay.Afternoon;
              if (t.includes('evening')) return TimeOfDay.Evening;
              return TimeOfDay.Morning;
            });
          } else if (trimmed.startsWith('- **Category**:')) {
            entry.category = trimmed.replace('- **Category**:', '').trim();
          } else if (trimmed.startsWith('- **Tags**:')) {
            const tagsText = trimmed.replace('- **Tags**:', '').trim();
            entry.tags = tagsText.split(',').map(t => t.trim());
          }
        }

        // Validate required fields
        if (entry.name && entry.description && entry.spots && entry.spots.length > 0 && 
            entry.priceRange && entry.bestTimes && entry.bestTimes.length > 0 && entry.category) {
          entries.push(entry as FoodEntry);
        }
      } catch (error) {
        console.warn('Failed to parse food entry:', item.title, error);
      }
    }

    return entries;
  }

  /**
   * Parse traffic routes from section content
   */
  private parseTrafficSection(content: string): TrafficRoute[] {
    const entries: TrafficRoute[] = [];
    const items = this.splitByH3Headers(content);

    for (const item of items) {
      try {
        const entry: Partial<TrafficRoute> = {
          name: item.title
        };

        // Parse bullet points
        const lines = item.content.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          
          if (trimmed.startsWith('- **From**:')) {
            entry.from = trimmed.replace('- **From**:', '').trim();
          } else if (trimmed.startsWith('- **To**:')) {
            entry.to = trimmed.replace('- **To**:', '').trim();
          } else if (trimmed.startsWith('- **Base Time**:')) {
            const timeText = trimmed.replace('- **Base Time**:', '').trim();
            entry.baseTime = parseInt(timeText.match(/\d+/)?.[0] || '0');
          } else if (trimmed.startsWith('- **Peak Time Multiplier**:')) {
            const multiplierText = trimmed.replace('- **Peak Time Multiplier**:', '').trim();
            entry.peakTimeMultiplier = parseFloat(multiplierText);
          } else if (trimmed.startsWith('- **Description**:')) {
            entry.description = trimmed.replace('- **Description**:', '').trim();
          }
        }

        // Validate required fields
        if (entry.name && entry.from && entry.to && entry.baseTime && entry.peakTimeMultiplier) {
          entries.push(entry as TrafficRoute);
        }
      } catch (error) {
        console.warn('Failed to parse traffic entry:', item.title, error);
      }
    }

    return entries;
  }

  /**
   * Parse culture entries from section content
   */
  private parseCultureSection(content: string): CultureEntry[] {
    const entries: CultureEntry[] = [];
    const items = this.splitByH3Headers(content);

    for (const item of items) {
      try {
        const entry: Partial<CultureEntry> = {
          title: item.title,
          details: []
        };

        // Parse bullet points
        const lines = item.content.split('\n');
        let inDetails = false;

        for (const line of lines) {
          const trimmed = line.trim();
          
          if (trimmed.startsWith('- **Category**:')) {
            const category = trimmed.replace('- **Category**:', '').trim().toLowerCase();
            entry.category = category as "neighborhood" | "startup" | "festival" | "coffee" | "living";
          } else if (trimmed.startsWith('- **Description**:')) {
            entry.description = trimmed.replace('- **Description**:', '').trim();
          } else if (trimmed.startsWith('- **Details**:')) {
            inDetails = true;
          } else if (trimmed.startsWith('- **Tags**:')) {
            inDetails = false;
            const tagsText = trimmed.replace('- **Tags**:', '').trim();
            entry.tags = tagsText.split(',').map(t => t.trim());
          } else if (inDetails && trimmed.startsWith('  - ')) {
            entry.details?.push(trimmed.replace('  - ', '').trim());
          }
        }

        // Validate required fields
        if (entry.title && entry.category && entry.description && entry.details && entry.details.length > 0) {
          entries.push(entry as CultureEntry);
        }
      } catch (error) {
        console.warn('Failed to parse culture entry:', item.title, error);
      }
    }

    return entries;
  }

  /**
   * Split content by ### headers
   */
  private splitByH3Headers(content: string): Array<{ title: string; content: string }> {
    const items: Array<{ title: string; content: string }> = [];
    const lines = content.split('\n');
    let currentItem: { title: string; content: string } | null = null;

    for (const line of lines) {
      if (line.startsWith('### ')) {
        if (currentItem) {
          items.push(currentItem);
        }
        currentItem = {
          title: line.replace('### ', '').trim(),
          content: ''
        };
      } else if (currentItem) {
        currentItem.content += line + '\n';
      }
    }

    // Add the last item
    if (currentItem) {
      items.push(currentItem);
    }

    return items;
  }

  /**
   * Validate parsed data
   */
  validateData(data: ParsedData): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Check if we have data in at least one module
    const hasData = data.slang.length > 0 || data.food.length > 0 || 
                    data.traffic.length > 0 || data.culture.length > 0;

    if (!hasData) {
      result.isValid = false;
      result.errors.push('No valid data found in knowledge base');
    }

    // Warn about empty modules
    if (data.slang.length === 0) {
      result.warnings.push('No slang entries found');
    }
    if (data.food.length === 0) {
      result.warnings.push('No food entries found');
    }
    if (data.traffic.length === 0) {
      result.warnings.push('No traffic routes found');
    }
    if (data.culture.length === 0) {
      result.warnings.push('No culture entries found');
    }

    return result;
  }

  /**
   * Load and parse the knowledge base file
   */
  async loadKnowledgeBase(): Promise<ParsedData> {
    try {
      // Try multiple paths for compatibility
      const paths = [
        '/LocalCultureGuide/product.md',  // GitHub Pages with base
        '/product.md',                     // Root path
        './product.md'                     // Relative path
      ];
      
      let response: Response | null = null;
      let lastError: Error | null = null;
      
      for (const path of paths) {
        try {
          response = await fetch(path);
          if (response.ok) {
            break;
          }
        } catch (error) {
          lastError = error as Error;
          continue;
        }
      }
      
      if (!response || !response.ok) {
        throw new Error(`Failed to load knowledge base from any path. Last error: ${lastError?.message || 'Unknown'}`);
      }
      
      const content = await response.text();
      const data = this.parseFile(content);
      
      // Validate the parsed data
      const validation = this.validateData(data);
      if (!validation.isValid) {
        console.error('Validation errors:', validation.errors);
      }
      if (validation.warnings.length > 0) {
        console.warn('Validation warnings:', validation.warnings);
      }

      return data;
    } catch (error) {
      console.error('Error loading knowledge base:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const parser = new KnowledgeBaseParser();
