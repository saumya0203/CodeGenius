import axios from 'axios';

// Mock code templates for different languages
const codeTemplates: Record<string, (description: string) => string> = {
  javascript: (desc) => `// ${desc}
function generateSolution() {
  // Example implementation
  const result = {
    message: "Generated solution for: " + desc,
    timestamp: new Date().toISOString()
  };
  
  return result;
}

// Example usage
console.log(generateSolution());`,

  typescript: (desc) => `// ${desc}
interface Solution {
  message: string;
  timestamp: string;
}

function generateSolution(): Solution {
  // Example implementation
  const result: Solution = {
    message: "Generated solution for: " + desc,
    timestamp: new Date().toISOString()
  };
  
  return result;
}

// Example usage
console.log(generateSolution());`,

  python: (desc) => `# ${desc}
from datetime import datetime

def generate_solution():
    # Example implementation
    result = {
        "message": f"Generated solution for: {desc}",
        "timestamp": datetime.now().isoformat()
    }
    
    return result

# Example usage
print(generate_solution())`,

  cpp: (desc) => `// ${desc}
#include <iostream>
#include <string>
#include <ctime>

class Solution {
private:
    std::string message;
    std::string timestamp;

public:
    Solution(const std::string& desc) {
        message = "Generated solution for: " + desc;
        
        time_t now = time(0);
        timestamp = ctime(&now);
    }

    void display() {
        std::cout << "Message: " << message << std::endl;
        std::cout << "Timestamp: " << timestamp;
    }
};

int main() {
    Solution solution("${desc}");
    solution.display();
    return 0;
}`,

  java: (desc) => `// ${desc}
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Solution {
    private String message;
    private String timestamp;

    public Solution() {
        this.message = "Generated solution for: ${desc}";
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME);
    }

    public void display() {
        System.out.println("Message: " + message);
        System.out.println("Timestamp: " + timestamp);
    }

    public static void main(String[] args) {
        Solution solution = new Solution();
        solution.display();
    }
}`,

  go: (desc) => `// ${desc}
package main

import (
    "fmt"
    "time"
)

type Solution struct {
    Message   string
    Timestamp string
}

func main() {
    solution := Solution{
        Message:   "Generated solution for: ${desc}",
        Timestamp: time.Now().Format(time.RFC3339),
    }

    fmt.Printf("Message: %s\\nTimestamp: %s\\n", solution.Message, solution.Timestamp)
}`,

  rust: (desc) => `// ${desc}
use chrono::prelude::*;

struct Solution {
    message: String,
    timestamp: String,
}

impl Solution {
    fn new(desc: &str) -> Self {
        Self {
            message: format!("Generated solution for: {}", desc),
            timestamp: Utc::now().to_rfc3339(),
        }
    }

    fn display(&self) {
        println!("Message: {}", self.message);
        println!("Timestamp: {}", self.timestamp);
    }
}

fn main() {
    let solution = Solution::new("${desc}");
    solution.display();
}`,

  kotlin: (desc) => `// ${desc}
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

data class Solution(
    val message: String = "Generated solution for: ${desc}",
    val timestamp: String = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME)
)

fun main() {
    val solution = Solution()
    println("Message: \${solution.message}")
    println("Timestamp: \${solution.timestamp}")
}`,

  ruby: (desc) => `# ${desc}
require 'time'

class Solution
  attr_reader :message, :timestamp

  def initialize
    @message = "Generated solution for: ${desc}"
    @timestamp = Time.now.iso8601
  end

  def display
    puts "Message: \#{message}"
    puts "Timestamp: \#{timestamp}"
  end
end

solution = Solution.new
solution.display`,

  scala: (desc) => `// ${desc}
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

object Solution extends App {
  case class Result(
    message: String = s"Generated solution for: ${desc}",
    timestamp: String = LocalDateTime.now.format(DateTimeFormatter.ISO_DATE_TIME)
  )

  val solution = Result()
  println(s"Message: \${solution.message}")
  println(s"Timestamp: \${solution.timestamp}")
}`,

  r: (desc) => `# ${desc}
library(jsonlite)

solution <- list(
  message = paste("Generated solution for:", "${desc}"),
  timestamp = format(Sys.time(), "%Y-%m-%dT%H:%M:%SZ")
)

print(toJSON(solution, pretty = TRUE))`,
};

export interface CodeGenerationResult {
  success: boolean;
  generatedCode?: string;
  error?: string;
}

export class CodeGenerationService {
  private getLanguageTemplate(language: string): (desc: string) => string {
    // Normalize language name to lowercase for case-insensitive matching
    const normalizedLang = language.toLowerCase();
    
    // Map some common language aliases
    const languageMap: Record<string, string> = {
      'c++': 'cpp',
      'typescript': 'typescript',
      'javascript': 'javascript',
      'python': 'python',
      'java': 'java',
      'golang': 'go',
      'rs': 'rust',
      'kt': 'kotlin',
      'rb': 'ruby'
    };

    // Get the mapped language or use the original
    const mappedLang = languageMap[normalizedLang] || normalizedLang;
    
    // Get the template for the language or fallback to JavaScript
    return codeTemplates[mappedLang] || codeTemplates.javascript;
  }

  private async simulateAPICall(prompt: string, language: string): Promise<string> {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const template = this.getLanguageTemplate(language);
    return template(prompt);
  }

  public async generateCode(prompt: string, language: string): Promise<CodeGenerationResult> {
    try {
      const generatedCode = await this.simulateAPICall(prompt, language);
      
      return {
        success: true,
        generatedCode,
      };
    } catch (error) {
      console.error('Code generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate code',
      };
    }
  }

  public async generateCodeCompletion(
    existingCode: string,
    language: string
  ): Promise<CodeGenerationResult> {
    try {
      // For completion, we'll analyze the existing code and generate a continuation
      const prompt = `Complete this code: ${existingCode.slice(0, 100)}...`;
      return this.generateCode(prompt, language);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to complete code',
      };
    }
  }

  public async generateCodeFromDescription(
    description: string,
    language: string
  ): Promise<CodeGenerationResult> {
    try {
      return this.generateCode(description, language);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate code from description',
      };
    }
  }
}

export const codeGeneration = new CodeGenerationService();